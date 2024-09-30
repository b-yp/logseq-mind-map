import { defineStore } from "pinia";
import { ref } from "vue";
import type MindMap from "simple-mind-map";

const useMindMapStore = defineStore("mindMap", () => {
  const mindMap = ref<MindMap | null>(null);
  const theme = ref("default");

  const getMindMap = () => mindMap.value;

  const getTheme = () => theme.value;

  const setMindMap = (mind: MindMap) => mindMap.value = mind;

  const setTheme = (currentTheme: string) => theme.value = currentTheme;

  return {
    mindMap,
    theme,
    getMindMap,
    getTheme,
    setMindMap,
    setTheme,
  };
});

export default useMindMapStore;
