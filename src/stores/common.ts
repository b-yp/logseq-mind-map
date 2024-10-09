import { defineStore } from "pinia";
import { ref } from "vue";

const useCommonStore = defineStore("common", () => {
  const isDrawerOpen = ref(false);
  const isDarkUI = ref(false);
  const currentDrawer = ref<string | null>(null);
  const mainRef = ref<HTMLDivElement>();
  const isFetchFailed = ref(false);

  const setIsDrawerOpen = (isOpen: boolean) => isDrawerOpen.value = isOpen;
  const setIsDarkUI = (isDark: boolean) => isDarkUI.value = isDark;
  const setCurrentDrawer = (drawer: string | null) => currentDrawer.value = drawer;
  const setMainRef = (ref: HTMLDivElement) => mainRef.value = ref;
  const setIsFetchFailed = (isFailed: boolean) => isFetchFailed.value = isFailed;

  return {
    isDrawerOpen,
    isDarkUI,
    currentDrawer,
    mainRef,
    isFetchFailed,
    setIsDrawerOpen,
    setIsDarkUI,
    setCurrentDrawer,
    setMainRef,
    setIsFetchFailed,
  };
});

export default useCommonStore;
