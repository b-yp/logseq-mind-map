import { defineStore } from "pinia";
import { ref } from "vue";

type RightClickType = "node" | "canvas";
type SyncNodeType = "self" | "parent" | "sibling" | "children";
type DrawerType =
  | "style"
  | "theme"
  | "structure"
  | "outline"
  | "search"
  | "export";

const useCommonStore = defineStore("common", () => {
  const isDrawerOpen = ref(false);
  const isDarkUI = ref(false);
  const currentDrawer = ref<DrawerType | null>(null);
  const mainRef = ref<HTMLDivElement>();
  const isFetchFailed = ref(false);
  const isShowMenu = ref<boolean>(false);
  const syncNodeType = ref<SyncNodeType>("self");
  const rightClickType = ref<RightClickType>("node");
  const menuLeft = ref<number>(0);
  const menuTop = ref<number>(0);

  const setIsDrawerOpen = (isOpen: boolean) => (isDrawerOpen.value = isOpen);
  const setIsDarkUI = (isDark: boolean) => (isDarkUI.value = isDark);
  const setCurrentDrawer = (drawer: DrawerType | null) =>
    (currentDrawer.value = drawer);
  const setMainRef = (ref: HTMLDivElement) => (mainRef.value = ref);
  const setIsFetchFailed = (isFailed: boolean) =>
    (isFetchFailed.value = isFailed);
  const setIsShowMenu = (isShow: boolean) => (isShowMenu.value = isShow);
  const setSyncNodeType = (type: SyncNodeType) => (syncNodeType.value = type);
  const setRightClickType = (type: RightClickType) =>
    (rightClickType.value = type);
  const setMenuLeft = (left: number) => (menuLeft.value = left);
  const setMenuTop = (top: number) => (menuTop.value = top);

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
    handleCloseMenu,
  };
});

export default useCommonStore;
