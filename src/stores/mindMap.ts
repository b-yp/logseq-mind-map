import { defineStore } from "pinia";
import { ref } from "vue";
import type MindMap from "simple-mind-map";
import { CONSTANTS } from "@/config/constant";

const useMindMapStore = defineStore("mindMap", () => {
  const mindMap = ref<MindMap | null>(null);
  const theme = ref("default");
  const layout = ref(CONSTANTS.LAYOUT.LOGICAL_STRUCTURE);

  const setMindMap = (mind: MindMap) => mindMap.value = mind;
  const setTheme = (currentTheme: string) => theme.value = currentTheme;
  const setLayout = (currentLayout: string) => layout.value = currentLayout;

  return {
    mindMap,
    theme,
    layout,
    setMindMap,
    setTheme,
    setLayout,
  };
});

export default useMindMapStore;
