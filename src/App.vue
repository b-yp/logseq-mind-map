<script lang="ts" setup>
import { onMounted, watch, ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import hotkeys from "hotkeys-js";
import classNames from "classnames";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";
import Search from "simple-mind-map/src/plugins/Search.js";
import Export from "simple-mind-map/src/plugins/Export.js";
import ExportPDF from "simple-mind-map/src/plugins/ExportPDF.js";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData, showToast, highlightCode } from "@/utils";
import SettingMenu from "@/components/SettingMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
import ToolDrawer from "@/components/ToolDrawer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import Guide from "@/components/Guide.vue";
import Icon from "@/components/Icon.vue";

MindMap.usePlugin(NodeImgAdjust);
MindMap.usePlugin(Search);
MindMap.usePlugin(Export);
MindMap.usePlugin(ExportPDF);

const logseqStore = useLogseqStore();
const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { setTrees } = logseqStore;
const { setMindMap, setData, setSearchInfo } = mindMapStore;
const { setMainRef } = commonStore;
const { page, trees, currentGraph } = storeToRefs(logseqStore);
const { mindMap } = storeToRefs(mindMapStore);
const { isDarkUI } = storeToRefs(commonStore);

const activeNode = ref<any>(null);
const codeEditor = ref<{
  isOpen: boolean;
  language: string;
  content: string;
}>({
  isOpen: false,
  language: "",
  content: "",
});
const mainRef = ref<HTMLDivElement>();
const lastNode = ref<any>(null);
const syncNodeType = ref<"self" | "parent" | "sibling" | "children">("self");
const rightClickType = ref<"node" | "canvas">("node");
const currentNode = ref<any>(null);
const menuLeft = ref<number>(0);
const menuTop = ref<number>(0);
const isShowMenu = ref<boolean>(false);
const mouseDownX = ref<number>(0);
const mouseDownY = ref<number>(0);
const isMouseDown = ref<boolean>(false);
const uidMap = ref<Record<string, string>>({});

onMounted(() => {
  setTimeout(() => {
    const mindMapContainer = document.getElementById("mindMapContainer")!;
    const mind = new MindMap({
      el: mindMapContainer,
      isUseCustomNodeContent: true,
      customCreateNodeContent: (node) => {
        codeEditor.value.content = node.nodeData.data.text;
        return highlightCode(node.nodeData.data.text, ({ language, code }) => {
          codeEditor.value.isOpen = true;
          codeEditor.value.language = language;
          codeEditor.value.content = code;
        });
      },
    } as any);
    setMindMap(mind);
  }, 100);

  hotkeys("esc", close);
});

onUnmounted(() => {
  hotkeys.unbind("esc", close);
  if (mindMap.value) {
    mindMap.value.off("node_tree_render_end", handleNodeTreeRenderEnd);
    mindMap.value.off("node_active", handleNodeActive);
    mindMap.value.off("hide_text_edit", handleHideTextEdit);
    mindMap.value.off("data_change", setData);
    mindMap.value.off("search_info_change", setSearchInfo);
    mindMap.value.off("node_contextmenu", handleNodeContextmenu);
    mindMap.value.off("node_click", handleCloseMenu);
    mindMap.value.off("draw_click", handleCloseMenu);
    mindMap.value.off("expand_btn_click", handleCloseMenu);
    mindMap.value.off("mousewheel", handleCloseMenu);
    mindMap.value.off("svg_mousedown", handleSvgMouseDown);
    mindMap.value.off("mouseup", handleMouseUp);
  }
});

watch([mindMap, page, trees, currentGraph], () => {
  if (!mindMap.value || !currentGraph.value) return;
  mindMap.value.updateData({
    data: {
      text: page.value?.name,
      uid: page.value?.id,
    },
    children: getData(trees.value, currentGraph.value),
  });

  uidMap.value = {};
  setTimeout(handleFitCanvas, 500);
});

watch(mindMap, () => {
  if (!mindMap.value) return;
  mindMap.value.on("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.value.on("node_active", handleNodeActive);
  mindMap.value.on("hide_text_edit", handleHideTextEdit);
  mindMap.value.on("data_change", setData);
  mindMap.value.on("search_info_change", setSearchInfo);
  mindMap.value.on("node_contextmenu", handleNodeContextmenu);
  mindMap.value.on("node_click", handleCloseMenu);
  mindMap.value.on("draw_click", handleCloseMenu);
  mindMap.value.on("expand_btn_click", handleCloseMenu);
  mindMap.value.on("mousewheel", handleCloseMenu);
  mindMap.value.on("node_dblclick", handleCloseMenu);
  mindMap.value.on("svg_mousedown", handleSvgMouseDown);
  mindMap.value.on("mouseup", handleMouseUp);

  mindMap.value.keyCommand.addShortcut("Tab", () => {
    lastNode.value = activeNode.value;
    syncNodeType.value = "children";
  });

  mindMap.value.keyCommand.addShortcut("Enter", () => {
    lastNode.value = activeNode.value;
    syncNodeType.value = "sibling";
  });

  // TODO: There is a bug in continuous deletion.
  // @ts-ignore
  mindMap.value.keyCommand.removeShortcut("Del");
  mindMap.value.keyCommand.addShortcut("Del", handleRemoveNode);
  // @ts-ignore
  mindMap.value.keyCommand.removeShortcut("Shift+Backspace");
  mindMap.value.keyCommand.addShortcut("Shift+Backspace", handleRemoveCurrentNode);
});

watch(mainRef, (ref) => {
  !!ref && setMainRef(ref);
});

const close = () => {
  if (codeEditor.value.isOpen) {
    codeEditor.value.isOpen = false;
    return;
  }
  if (import.meta.env.VITE_MODE === "web") return;
  logseq.hideMainUI();
};

const handleNodeTreeRenderEnd = () => {
  if (!mindMap.value) return;
  // handleFitCanvas();
};

const handleNodeActive = (res: any) => {
  res && (activeNode.value = res);
};

const handleHideTextEdit = async () => {
  const data = activeNode.value?.getData();
  const lastNodeData = lastNode.value?.getData();
  const currentUid =
    lastNodeData && (uidMap.value[lastNodeData.uid] || lastNodeData.uid);

  let res: BlockEntity | boolean | null = null;
  try {
    switch (syncNodeType.value) {
      case "self":
        await logseq.Editor.updateBlock(data.uid, data.text);
        res = true;
        break;
      case "children":
        const childrenRes = await logseq.Editor.appendBlockInPage(
          currentUid,
          data.text
        );
        uidMap.value[data.uid] = childrenRes?.uuid || "";
        res = childrenRes;
        break;
      case "sibling":
        const siblingRes = await logseq.Editor.insertBlock(
          currentUid,
          data.text,
          {
            sibling: true,
          }
        );
        uidMap.value[data.uid] = siblingRes?.uuid || "";
        res = siblingRes;
        break;
    }
  } catch (error) {
    res = false;
    showToast((error as Error).message, "error");
  }

  if (res) {
    showToast(`Update ${syncNodeType.value} Success!`, "success");
  }
  syncNodeType.value = "self";
};

const handleSave = async (value: string, language: string) => {
  await logseq.Editor.updateBlock(
    activeNode.value?.getData()?.uid,
    `
\`\`\`${language}
${value}
\`\`\`
    `
  );

  const tree = page.value?.uuid
    ? await logseq.Editor.getPageBlocksTree(page.value.uuid)
    : [];

  setTrees(tree);

  codeEditor.value.isOpen = false;
  showToast("Update Success!", "success");
};

const handleNodeContextmenu = (e, node) => {
  rightClickType.value = "node";
  menuLeft.value = e.clientX + 10;
  menuTop.value = e.clientY + 10;
  isShowMenu.value = true;
  currentNode.value = node;
};

const handleCloseMenu = () => {
  isShowMenu.value = false;
  menuLeft.value = 0;
  menuTop.value = 0;
};

const handleInsertSiblingNode = () => {
  mindMap.value?.execCommand("INSERT_NODE");
  lastNode.value = activeNode.value;
  syncNodeType.value = "sibling";
};

const handleInsertChildNode = () => {
  mindMap.value?.execCommand("INSERT_CHILD_NODE");
  lastNode.value = activeNode.value;
  syncNodeType.value = "children";
};

const handleRemoveNode = () => {
  mindMap.value?.execCommand("REMOVE_NODE");
  const data = activeNode.value.getData();
  logseq.Editor.removeBlock(data.uid)
    .then(() => {
      showToast("删除成功", "success");
    })
    .catch((error) => {
      showToast("删除失败：" + error, "error");
    })
    .finally(handleCloseMenu);
};

const handleRemoveCurrentNode = async () => {
  mindMap.value?.execCommand("REMOVE_CURRENT_NODE");
  const data = activeNode.value.getData();
  const block = await logseq.Editor.getBlock(data.uid);
  const childrenUids =
    block?.children?.map((child) => child[1] as string) || [];

  for (const uid of childrenUids.reverse()) {
    await logseq.Editor.moveBlock(uid, data.uid, {
      before: false,
      children: false,
    });
  }

  logseq.Editor.removeBlock(data.uid)
    .then(() => {
      showToast("删除成功", "success");
    })
    .catch((error) => {
      showToast("删除失败：" + error, "error");
    })
    .finally(handleCloseMenu);
};

const handleSvgMouseDown = (e) => {
  if (e.which !== 3) return;
  mouseDownX.value = e.clientX;
  mouseDownY.value = e.clientY;
  isMouseDown.value = true;
};

const handleMouseUp = (e) => {
  if (!isMouseDown.value) return isMouseDown.value = false;

  if (
    Math.abs(mouseDownX.value - e.clientX) > 3 ||
    Math.abs(mouseDownY.value - e.clientY) > 3
  ) return handleCloseMenu();

  rightClickType.value = "canvas";
  isShowMenu.value = true;
  menuLeft.value = e.clientX + 10;
  menuTop.value = e.clientY + 10;
};

const handleBackToRootNode = () => {
  mindMap.value?.renderer.setRootNodeCenter()
};

const handleExpandAll = () => {
  mindMap.value?.execCommand("EXPAND_ALL")
};

const handleCollapseAll = () => {
  mindMap.value?.execCommand("UNEXPAND_ALL")
};

const handleExpandToLevel = (level: number) => {
  mindMap.value?.execCommand("UNEXPAND_TO_LEVEL", level)
};

const handleFitCanvas = () => {
  mindMap.value?.view.fit(() => { }, false, 20);
};
</script>

<template>
  <div id="main" :data-theme="isDarkUI ? 'dark' : 'light'" ref="mainRef">
    <div id="mindMapContainer"></div>
    <SettingMenu />
    <ToolBar />
    <ToolDrawer />
    <CodeEditor :is-open="codeEditor.isOpen" :value="codeEditor.content" :language="codeEditor.language"
      :is-dark-u-i="isDarkUI" @close="codeEditor = { isOpen: false, language: '', content: '' }" @save="handleSave" />
    <Guide />
    <ul v-show="isShowMenu && rightClickType === 'node'" :class="classNames('menu bg-base-200 rounded-box fixed')"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
      <li @click="handleInsertSiblingNode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.insertSiblingNode") }}</span>
          <kbd class="kbd kbd-sm">Enter</kbd>
        </div>
      </li>
      <li @click="handleInsertChildNode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.insertChildNode") }}</span>
          <kbd class="kbd kbd-sm">Tab</kbd>
        </div>
      </li>
      <div class="divider m-0"></div>
      <li @click="handleRemoveNode">
        <div class="w-full flex items-center justify-between">
          <span class="text-error">{{ $t("rightMenu.deleteNode") }}</span>
          <kbd class="kbd kbd-sm">Delete</kbd>
        </div>
      </li>
      <li @click="handleRemoveCurrentNode">
        <div class="w-full flex items-center justify-between">
          <span class="text-error">{{
            $t("rightMenu.deleteCurrentNode")
          }}</span>
          <div>
            <kbd class="kbd kbd-sm">Shift</kbd>
            <span>+</span>
            <kbd class="kbd kbd-sm">Backspace</kbd>
          </div>
        </div>
      </li>
    </ul>

    <ul v-show="isShowMenu && rightClickType === 'canvas'" :class="classNames('menu bg-base-200 rounded-box fixed')"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
      <li @click="handleBackToRootNode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.backRootNode") }}</span>
          <div>
            <kbd class="kbd kbd-sm">Ctrl</kbd>
            <span>+</span>
            <kbd class="kbd kbd-sm">Enter</kbd>
          </div>
        </div>
      </li>
      <div class="divider m-0"></div>
      <li @click="handleExpandAll">
        <span>{{ $t("rightMenu.expandAll") }}</span>
      </li>
      <li @click="handleCollapseAll">
        <span>{{ $t("rightMenu.collapseAll") }}</span>
      </li>
      <div class="dropdown dropdown-hover dropdown-right">
        <li>
          <div class="w-full flex items-center justify-between" tabindex="0">
            <span>{{ $t("rightMenu.expandTo") }}</span>
            <Icon name="right" class="text-gray-500" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 -translate-x-4 shadow">
            <li v-for="level in Array.from({ length: 6 }, (_, index) => index + 1)" :key="level" @click="handleExpandToLevel(level)">
              <a>
                {{ $t(`rightMenu.level${level}`) }}
              </a>
            </li>
          </ul>
        </li>
      </div>
      <div class="divider m-0"></div>
      <li @click="handleFitCanvas">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.fitCanvas") }}</span>
          <div>
            <kbd class="kbd kbd-sm">Ctrl</kbd>
            <span>+</span>
            <kbd class="kbd kbd-sm">I</kbd>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
@import "./css/simpleMindMap.esm.css";

#main {
  width: 100vw;
  height: 100vh;
}

.close-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
}

#mindMapContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
