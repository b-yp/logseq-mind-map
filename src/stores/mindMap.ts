import { defineStore } from "pinia";
import { ref } from "vue";
import type MindMap from "simple-mind-map";
import { CONSTANTS } from "@/config/constant";

const useMindMapStore = defineStore("mindMap", () => {
  const mindMap = ref<MindMap | null>(null);
  const theme = ref("default");
  const layout = ref(CONSTANTS.LAYOUT.LOGICAL_STRUCTURE);
  const data = ref<IMindMap.Data | null>(null);

  const setMindMap = (mind: MindMap) => mindMap.value = mind;
  const setTheme = (currentTheme: string) => theme.value = currentTheme;
  const setLayout = (currentLayout: string) => layout.value = currentLayout;
  const setData = (currentData: IMindMap.Data) => data.value = currentData;

  return {
    mindMap,
    theme,
    layout,
    data,
    setMindMap,
    setTheme,
    setLayout,
    setData,
  };
});

export default useMindMapStore;
