<script lang="ts" setup>
import { onMounted, watch, ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import hotkeys from "hotkeys-js";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";
import Search from "simple-mind-map/src/plugins/Search.js";
import Export from "simple-mind-map/src/plugins/Export.js";
import ExportPDF from "simple-mind-map/src/plugins/ExportPDF.js";

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData, showToast, highlightCode } from "@/utils";
import SettingMenu from "@/components/SettingMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
import ToolDrawer from "@/components/ToolDrawer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import Dialog from "@/components/Dialog.vue";

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
const { isDarkUI, isFetchFailed } = storeToRefs(commonStore);

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
  }
})

watch([mindMap, page, trees, currentGraph], () => {
  if (!mindMap.value || !currentGraph.value) return;
  mindMap.value.updateData({
    data: {
      text: page.value?.name,
      uid: page.value?.id,
    },
    children: getData(trees.value, currentGraph.value),
  });

  setTimeout(() => {
    mindMap.value?.view.fit(() => {}, false, 20);
  }, 500);
});

watch(mindMap, () => {
  if (!mindMap.value) return;
  mindMap.value.on("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.value.on("node_active", handleNodeActive);
  mindMap.value.on("hide_text_edit", handleHideTextEdit);
  mindMap.value.on("data_change", setData);
  mindMap.value.on("search_info_change", setSearchInfo);
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
  // mindMap.value.view.fit(() => {}, false, 20);
};

const handleNodeActive = (res: any) => {
  !!res && (activeNode.value = res);
};

const handleHideTextEdit = () => {
  const data = activeNode.value?.getData();
  logseq.Editor.updateBlock(data.uid, data.text).then(() => {
    showToast("Update Success!", "success");
  });
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
</script>

<template>
  <div id="main" :data-theme="isDarkUI ? 'dark' : 'light'" ref="mainRef">
    <div id="mindMapContainer"></div>
    <SettingMenu />
    <ToolBar />
    <ToolDrawer />
    <CodeEditor
      :is-open="codeEditor.isOpen"
      :value="codeEditor.content"
      :language="codeEditor.language"
      :is-dark-u-i="isDarkUI"
      @close="codeEditor = { isOpen: false, language: '', content: '' }"
      @save="handleSave"
    />
    <Dialog
      :is-open="isFetchFailed"
      :title="$t('webGuide.title')"
    >
      <ul class="mt-4">
        <li class="mb-4">
          <h3>1. {{ $t('webGuide.setting.1') }}</h3>
          <img class="ml-4" src="./assets/images/screenshots/set-1.png" alt="1" />
        </li>
        <li class="mb-4">
          <h3>2. {{ $t('webGuide.setting.2') }}</h3>
          <img class="ml-4" src="./assets/images/screenshots/set-2.png" alt="2" />
        </li>
        <li class="mb-4">
          <h3>3. {{ $t('webGuide.setting.3') }}</h3>
          <img class="ml-4" src="./assets/images/screenshots/set-3.png" alt="3" />
        </li>
        <li class="mb-4">
          <h3>4. {{ $t('webGuide.setting.4') }}</h3>
          <img class="ml-4" src="./assets/images/screenshots/set-4.png" alt="4" />
        </li>
      </ul>
    </Dialog>
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
