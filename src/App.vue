<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";
import hotkeys from "hotkeys-js";

import useMindStore from "./stores/mind";
import { getData } from "./utils";

MindMap.usePlugin(NodeImgAdjust);

const mindStore = useMindStore();
const { getPage, getTrees, getCurrentGraph } = mindStore;

const mindMap = ref<MindMap | null>(null);

onMounted(() => {
  setTimeout(() => {
    const mindMapContainer = document.getElementById("mindMapContainer")!;
    const mind = new MindMap({
      el: mindMapContainer,
    } as any);
    mindMap.value = mind;
  }, 100);

  hotkeys("esc", () => {
    close();
  });
});

watch([mindMap, getPage, getTrees, getCurrentGraph], () => {
  const currentGraph = getCurrentGraph();
  const trees = getTrees();
  const page = getPage();
  if (!mindMap.value || !currentGraph) return;
  mindMap.value.updateData({
    data: {
      text: page?.name,
    },
    children: getData(trees, currentGraph),
  });
});

const close = () => {
  logseq.hideMainUI();
};
</script>

<template>
  <div id="main">
    <button class="close-btn" @click="close">Close</button>
    <div id="mindMapContainer"></div>
  </div>
</template>

<style>
@import "./css/simpleMindMap.esm.css";

#main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
}

#mindMapContainer {
  width: 90%;
  height: 90%;
}
</style>
