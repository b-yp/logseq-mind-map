import { defineStore } from "pinia";
import { ref } from "vue";

const useCommonStore = defineStore(
  "common",
  () => {
    const isDrawerOpen = ref(false);
    const isDarkUI = ref(false);
    const currentDrawer = ref<IMindMap.DrawerType | null>(null);
    const mainRef = ref<HTMLDivElement>();
    const isFetchFailed = ref(false);
    const isShowMenu = ref<boolean>(false);
    const syncNodeType = ref<IMindMap.SyncNodeType>("self");
    const rightClickType = ref<IMindMap.RightClickType>("node");
    const menuLeft = ref<number>(0);
    const menuTop = ref<number>(0);
    const lang = ref<string>("English");
    const isWeb = ref(false);
    const isShowGuide = ref(false);

    const setIsDrawerOpen = (isOpen: boolean) => (isDrawerOpen.value = isOpen);
    const setIsDarkUI = (isDark: boolean) => {
      isDarkUI.value = isDark;
    };
    const setCurrentDrawer = (drawer: IMindMap.DrawerType | null) =>
      (currentDrawer.value = drawer);
    const setMainRef = (ref: HTMLDivElement) => (mainRef.value = ref);
    const setIsFetchFailed = (isFailed: boolean) =>
      (isFetchFailed.value = isFailed);
    const setIsShowMenu = (isShow: boolean) => (isShowMenu.value = isShow);
    const setSyncNodeType = (type: IMindMap.SyncNodeType) =>
      (syncNodeType.value = type);
    const setRightClickType = (type: IMindMap.RightClickType) =>
      (rightClickType.value = type);
    const setMenuLeft = (left: number) => (menuLeft.value = left);
    const setMenuTop = (top: number) => (menuTop.value = top);
    const setLang = (value: string) => (lang.value = value);
    const setIsWeb = (value: boolean) => (isWeb.value = value);
    const setIsShowGuide = (value: boolean) => (isShowGuide.value = value);

    const handleCloseMenu = () => {
      isShowMenu.value = false;
      menuLeft.value = 0;
      menuTop.value = 0;
    };

    return {
      isDrawerOpen,
      isDarkUI,
      currentDrawer,
      mainRef,
      isFetchFailed,
      rightClickType,
      menuLeft,
      menuTop,
      isShowMenu,
      syncNodeType,
      lang,
      isWeb,
      isShowGuide,
      setIsDrawerOpen,
      setIsDarkUI,
      setCurrentDrawer,
      setMainRef,
      setIsFetchFailed,
      setRightClickType,
      setMenuLeft,
      setMenuTop,
      setIsShowMenu,
      setSyncNodeType,
      setLang,
      setIsWeb,
      setIsShowGuide,
      handleCloseMenu,
    };
  },
  {
    persist: {
      pick: ["isDarkUI", "lang"],
    },
  }
);

export default useCommonStore;
