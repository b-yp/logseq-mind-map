import { defineStore } from "pinia";
import { ref } from "vue";

const useCommonStore = defineStore("common", () => {
  const isDrawerOpen = ref(false);
  const isDarkUI = ref(false);
  const currentDrawer = ref<string | null>(null);

  const setIsDrawerOpen = (isOpen: boolean) => isDrawerOpen.value = isOpen;
  const setIsDarkUI = (isDark: boolean) => isDarkUI.value = isDark;
  const setCurrentDrawer = (drawer: string | null) => currentDrawer.value = drawer;
  return {
    isDrawerOpen,
    isDarkUI,
    currentDrawer,
    setIsDrawerOpen,
    setIsDarkUI,
    setCurrentDrawer,
  };
});

export default useCommonStore;
