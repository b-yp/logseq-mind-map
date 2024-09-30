import { defineStore } from "pinia";
import { ref } from "vue";

const useCommonStore = defineStore("common", () => {
  const isThemeDrawerOpen = ref(false);
  const isDarkUI = ref(false);

  const getIsThemeDrawerOpen = () =>  isThemeDrawerOpen.value;

  const getIsDarkUI = () => isDarkUI.value;

  const setIsThemeDrawerOpen = (isOpen: boolean) => isThemeDrawerOpen.value = isOpen;

  const setIsDarkUI = (isDark: boolean) => isDarkUI.value = isDark;

  return {
    isThemeDrawerOpen,
    isDarkUI,
    getIsThemeDrawerOpen,
    getIsDarkUI,
    setIsThemeDrawerOpen,
    setIsDarkUI,
  };
});

export default useCommonStore;
