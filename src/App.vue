<script lang="ts" setup>
import { onMounted, watch, ref } from "vue";
import hotkeys from "hotkeys-js";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData, showToast } from "@/utils";
import SettingMenu from "@/components/SettingMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
import Theme from "@/components/Theme.vue";

MindMap.usePlugin(NodeImgAdjust);

const logseqStore = useLogseqStore();
const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { getPage, getTrees, getCurrentGraph } = logseqStore;
const { getMindMap, setMindMap } = mindMapStore;
const { getIsDarkUI } = commonStore;

const activeNode = ref<any>(null);

onMounted(() => {
  setTimeout(() => {
    const mindMapContainer = document.getElementById("mindMapContainer")!;
    const mind = new MindMap({
      el: mindMapContainer,
    } as any);
    setMindMap(mind);
  }, 100);

  hotkeys("esc", () => {
    close();
  });
});

watch([getMindMap, getPage, getTrees, getCurrentGraph], () => {
  const currentGraph = getCurrentGraph();
  const trees = getTrees();
  const page = getPage();
  const mindMap = getMindMap();
  if (!mindMap || !currentGraph) return;
  mindMap.updateData({
    data: {
      text: page?.name,
      uid: page?.uuid,
    },
    children: getData(trees, currentGraph),
  });

  setTimeout(mindMap.view.fit, 500);
});

watch(getMindMap, () => {
  const mindMap = getMindMap();
  if (!mindMap) return;

  mindMap.on("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.on("node_active", handleNodeActive);
  mindMap.on("hide_text_edit", handleHideTextEdit);
});

const close = () => {
  logseq.hideMainUI();
  const mindMap = getMindMap();
  if (!mindMap) return;

  mindMap.off("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.off("node_active", handleNodeActive);
  mindMap.off("hide_text_edit", handleHideTextEdit);
};

const handleNodeTreeRenderEnd = () => {
  const mindMap = getMindMap();
  if (!mindMap) return;
  mindMap.view.fit(() => {}, false, 20);
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
  <div id="main" :data-theme="getIsDarkUI() ? 'dark' : 'light'">
    <div id="mindMapContainer"></div>
    <SettingMenu />
    <ToolBar />
    <Theme />
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
