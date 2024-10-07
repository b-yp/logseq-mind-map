<script lang="ts" setup>
import { onMounted, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import hotkeys from "hotkeys-js";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";
import Search from "simple-mind-map/src/plugins/Search.js";
import Export from 'simple-mind-map/src/plugins/Export.js'
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData, showToast } from "@/utils";
import SettingMenu from "@/components/SettingMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
import ToolDrawer from "@/components/ToolDrawer.vue";

MindMap.usePlugin(NodeImgAdjust);
MindMap.usePlugin(Search);
MindMap.usePlugin(Export);
MindMap.usePlugin(ExportPDF);

const logseqStore = useLogseqStore();
const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { page, trees, currentGraph } = storeToRefs(logseqStore);
const { setMindMap, setData, setSearchInfo } = mindMapStore;
const { mindMap } = storeToRefs(mindMapStore);
const { isDarkUI } = storeToRefs(commonStore);

const activeNode = ref<any>(null);

onMounted(() => {
  setTimeout(() => {
    const mindMapContainer = document.getElementById("mindMapContainer")!;
    const mind = new MindMap({
      el: mindMapContainer,
    } as any);
    setMindMap(mind);
  }, 100);

  hotkeys("esc", close);
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

  setTimeout(mindMap.value.view.fit, 500);
});

watch(mindMap, () => {
  if (!mindMap.value) return;
  mindMap.value.on("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.value.on("node_active", handleNodeActive);
  mindMap.value.on("hide_text_edit", handleHideTextEdit);
  mindMap.value.on('data_change', setData);
  mindMap.value.on('search_info_change', setSearchInfo);
});

const close = () => {
  logseq.hideMainUI();
  if (!mindMap.value) return;
  mindMap.value.off("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.value.off("node_active", handleNodeActive);
  mindMap.value.off("hide_text_edit", handleHideTextEdit);
  mindMap.value.off('data_change', setData);
  mindMap.value.off('search_info_change', setSearchInfo);
};

const handleNodeTreeRenderEnd = () => {
  mindMap.value?.view.fit(() => { }, false, 20);
};

const handleNodeActive = (res: any) => {
  activeNode.value = res;
};

const handleHideTextEdit = () => {
  const data = activeNode.value?.getData();
  logseq.Editor.updateBlock(data.uid, data.text).then(() => {
    showToast("Update Success!", "success");
  });
};
</script>

<template>
  <div id="main" :data-theme="isDarkUI ? 'dark' : 'light'">
    <div id="mindMapContainer"></div>
    <SettingMenu />
    <ToolBar />
    <ToolDrawer />
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
