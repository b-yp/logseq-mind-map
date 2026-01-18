import { defineStore } from "pinia";
import { ref, shallowRef, markRaw } from "vue";
import type MindMap from "simple-mind-map";
import { CONSTANTS } from "@/config/constant";
import { showToast } from "@/utils";
import useCommonStore from "./common";

const useMindMapStore = defineStore(
  "mindMap",
  () => {
    const commonStore = useCommonStore();
    const { handleCloseMenu } = commonStore;

    const mindMap = shallowRef<MindMap | null>(null);
    const theme = ref("default");
    const layout = ref(CONSTANTS.LAYOUT.LOGICAL_STRUCTURE);
    const data = ref<IMindMap.Data | null>(null);
    const searchInfo = ref<IMindMap.SearchInfo>({
      currentIndex: 0,
      total: 0,
    });
    const activeNode = shallowRef<any>(null);
    const lastNode = shallowRef<any>(null);
    const isZenMode = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const themeConfig = ref<IMindMap.ThemeConfig>({
      backgroundColor: "#ffffff",
      backgroundImage: "",
      lineColor: "#000000",
      lineWidth: 1,
      lineStyle: "straight",
      showLineMarker: false,
    });

    const setMindMap = (mind: MindMap) => (mindMap.value = markRaw(mind));
    const setTheme = (currentTheme: string) => (theme.value = currentTheme);
    const setLayout = (currentLayout: string) => (layout.value = currentLayout);
    const setData = (currentData: IMindMap.Data) => (data.value = currentData);
    const setSearchInfo = (currentSearchInfo: IMindMap.SearchInfo) =>
      (searchInfo.value = currentSearchInfo);
    const setActiveNode = (node: any) => (activeNode.value = node ? markRaw(node) : null);
    const setLastNode = (node: any) => (lastNode.value = node ? markRaw(node) : null);
    const setIsZenMode = (isZen: boolean) => (isZenMode.value = isZen);
    const setIsLoading = (isLoad: boolean) => (isLoading.value = isLoad);
    const setThemeConfig = (config: IMindMap.ThemeConfig) =>
      (themeConfig.value = config);

    const handleExpandToLevel = (level: number) => {
      mindMap.value?.execCommand("UNEXPAND_TO_LEVEL", level);
    };
    const handleFitCanvas = () => {
      mindMap.value?.view.fit(() => { }, false, 20);
    };
    const handleRemoveCurrentNode = async () => {
      try {
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

        await logseq.Editor.removeBlock(data.uid);
        showToast("删除成功", "success");
      } catch (error) {
        showToast("删除失败：" + error, "error");
      } finally {
        handleCloseMenu();
      }
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
      isLoading,
      themeConfig,
      setMindMap,
      setTheme,
      setLayout,
      setData,
      setSearchInfo,
      setActiveNode,
      setLastNode,
      setIsZenMode,
      setIsLoading,
      setThemeConfig,
      handleExpandToLevel,
      handleFitCanvas,
      handleRemoveCurrentNode,
      handleRemoveNode,
    };
  },
  {
    persist: {
      pick: ["theme", "layout", "themeConfig"],
    },
  }
);

export default useMindMapStore;
