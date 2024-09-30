<script lang="ts" setup>
import { onMounted, watch } from "vue";
import hotkeys from "hotkeys-js";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData } from "@/utils";
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
    },
    children: getData(trees, currentGraph),
  });

  setTimeout(mindMap.view.fit, 500);
});

watch(getMindMap, () => {
  const mindMap = getMindMap();
  if (!mindMap) return;
  mindMap.on("node_tree_render_end", () => {
    mindMap.view.fit(() => {}, false, 20);
  });
});

const close = () => {
  logseq.hideMainUI();
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
