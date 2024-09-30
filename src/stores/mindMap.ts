import { defineStore } from "pinia";
import { ref } from "vue";
import type MindMap from "simple-mind-map";

const useMindMapStore = defineStore("mindMap", () => {
  const mindMap = ref<MindMap | null>(null);

  const getMindMap = () => {
    return mindMap.value;
  };

  const setMindMap = (mind: MindMap) => {
    mindMap.value = mind;
  };

  return {
    mindMap,
    getMindMap,
    setMindMap,
  };
});

export default useMindMapStore;
