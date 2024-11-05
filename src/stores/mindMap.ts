import { defineStore } from "pinia";
import { ref } from "vue";
import type MindMap from "simple-mind-map";
import { CONSTANTS } from "@/config/constant";
import { showToast } from "@/utils";
import useCommonStore from "./common";

const useMindMapStore = defineStore("mindMap", () => {
  const commonStore = useCommonStore();
  const { handleCloseMenu } = commonStore;

  const mindMap = ref<MindMap | null>(null);
  const theme = ref("default");
  const layout = ref(CONSTANTS.LAYOUT.LOGICAL_STRUCTURE);
  const data = ref<IMindMap.Data | null>(null);
  const searchInfo = ref<IMindMap.SearchInfo>({
    currentIndex: 0,
    total: 0,
  });
  const activeNode = ref<any>(null);
  const lastNode = ref<any>(null);
  const isZenMode = ref<boolean>(false);
  const themeConfig = ref<IMindMap.ThemeConfig>({
    backgroundColor: "#ffffff",
    backgroundImage: "",
    lineColor: "#000000",
    lineWidth: 1,
    lineStyle: "straight",
    showLineMarker: false
  });

  const setMindMap = (mind: MindMap) => (mindMap.value = mind);
  const setTheme = (currentTheme: string) => (theme.value = currentTheme);
  const setLayout = (currentLayout: string) => (layout.value = currentLayout);
  const setData = (currentData: IMindMap.Data) => (data.value = currentData);
  const setSearchInfo = (currentSearchInfo: IMindMap.SearchInfo) =>
    (searchInfo.value = currentSearchInfo);
  const setActiveNode = (node: any) => (activeNode.value = node);
  const setLastNode = (node: any) => (lastNode.value = node);
  const setIsZenMode = (isZen: boolean) => (isZenMode.value = isZen);
  const setThemeConfig = (config: IMindMap.ThemeConfig) =>
    (themeConfig.value = config);

  const handleExpandToLevel = (level: number) => {
    mindMap.value?.execCommand("UNEXPAND_TO_LEVEL", level);
  };
  const handleFitCanvas = () => {
    mindMap.value?.view.fit(() => {}, false, 20);
  };
  const handleRemoveCurrentNode = async () => {
    mindMap.value?.execCommand("REMOVE_CURRENT_NODE");
    const data = activeNode.value.getData();
    const block = await logseq.Editor.getBlock(data.uid);
    const childrenUids =
      block?.children?.map((child) => child[1] as string) || [];

    for (const uid of childrenUids.reverse()) {
      await logseq.Editor.moveBlock(uid, data.uid, {
        before: false,
        children: false,
      });
    }

    logseq.Editor.removeBlock(data.uid)
      .then(() => {
        showToast("删除成功", "success");
      })
      .catch((error) => {
        showToast("删除失败：" + error, "error");
      })
      .finally(handleCloseMenu);
  };
  const handleRemoveNode = () => {
    mindMap.value?.execCommand("REMOVE_NODE");
    const data = activeNode.value.getData();
    logseq.Editor.removeBlock(data.uid)
      .then(() => {
        showToast("删除成功", "success");
      })
      .catch((error) => {
        showToast("删除失败：" + error, "error");
      })
      .finally(handleCloseMenu);
  };

  return {
    mindMap,
    theme,
    layout,
    data,
    searchInfo,
    activeNode,
    lastNode,
    isZenMode,
    themeConfig,
    setMindMap,
    setTheme,
    setLayout,
    setData,
    setSearchInfo,
    setActiveNode,
    setLastNode,
    setIsZenMode,
    setThemeConfig,
    handleExpandToLevel,
    handleFitCanvas,
    handleRemoveCurrentNode,
    handleRemoveNode,
  };
});

export default useMindMapStore;
