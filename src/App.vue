<script lang="ts" setup>
import { onMounted, watch, ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import hotkeys from "hotkeys-js";
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
import RightMenu from "./components/RightMenu.vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

MindMap.usePlugin(NodeImgAdjust);
MindMap.usePlugin(Search);
MindMap.usePlugin(Export);
MindMap.usePlugin(ExportPDF);

const logseqStore = useLogseqStore();
const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { setTrees } = logseqStore;
const {
  setMindMap,
  setData,
  setSearchInfo,
  setActiveNode,
  setLastNode,
  handleFitCanvas,
  handleRemoveCurrentNode,
  handleRemoveNode,
} = mindMapStore;
const {
  setMainRef,
  handleCloseMenu,
  setSyncNodeType,
  setMenuLeft,
  setMenuTop,
  setIsShowMenu,
  setRightClickType,
} = commonStore;
const { page, trees, currentGraph } = storeToRefs(logseqStore);
const { mindMap, activeNode, lastNode, isZenMode, themeConfig, theme, layout } =
  storeToRefs(mindMapStore);
const { isDarkUI, syncNodeType, lang } = storeToRefs(commonStore);

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
const mouseDownX = ref<number>(0);
const mouseDownY = ref<number>(0);
const isMouseDown = ref<boolean>(false);
const uidMap = ref<Record<string, string>>({});

onMounted(() => {
  locale.value = lang.value;
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
  const nodes = getData(trees.value, currentGraph.value);
  mindMap.value.setThemeConfig(themeConfig.value);
  mindMap.value.setLayout(layout.value);
  mindMap.value.setTheme(theme.value);
  mindMap.value.updateData({
    data: {
      text: page.value?.name,
      uid: page.value?.id,
    },
    children: nodes,
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
    setLastNode(activeNode.value);
    setSyncNodeType("children");
  });

  mindMap.value.keyCommand.addShortcut("Enter", () => {
    setLastNode(activeNode.value);
    setSyncNodeType("sibling");
  });

  // TODO: There is a bug in continuous deletion.
  // @ts-ignore
  mindMap.value.keyCommand.removeShortcut("Del");
  mindMap.value.keyCommand.addShortcut("Del", handleRemoveNode);
  // @ts-ignore
  mindMap.value.keyCommand.removeShortcut("Shift+Backspace");
  mindMap.value.keyCommand.addShortcut(
    "Shift+Backspace",
    handleRemoveCurrentNode
  );
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
  res && setActiveNode(res);
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
  setSyncNodeType("self");
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
  setRightClickType("node");
  setMenuLeft(e.clientX + 10);
  setMenuTop(e.clientY + 10);
  setIsShowMenu(true);
  setActiveNode(node);
};

const handleSvgMouseDown = (e) => {
  if (e.which !== 3) return;
  mouseDownX.value = e.clientX;
  mouseDownY.value = e.clientY;
  isMouseDown.value = true;
};

const handleMouseUp = (e) => {
  if (!isMouseDown.value) return (isMouseDown.value = false);

  if (
    Math.abs(mouseDownX.value - e.clientX) > 3 ||
    Math.abs(mouseDownY.value - e.clientY) > 3
  )
    return handleCloseMenu();

  setRightClickType("canvas");
  setIsShowMenu(true);
  setMenuLeft(e.clientX + 10);
  setMenuTop(e.clientY + 10);
};
</script>

<template>
  <div id="main" :data-theme="isDarkUI ? 'dark' : 'light'" ref="mainRef">
    <div id="mindMapContainer"></div>
    <SettingMenu v-show="!isZenMode" />
    <ToolBar v-show="!isZenMode" />
    <ToolDrawer v-show="!isZenMode" />
    <CodeEditor
      :is-open="codeEditor.isOpen"
      :value="codeEditor.content"
      :language="codeEditor.language"
      :is-dark-u-i="isDarkUI"
      @close="codeEditor = { isOpen: false, language: '', content: '' }"
      @save="handleSave"
    />
    <Guide />
    <RightMenu />
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
