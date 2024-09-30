import { defineStore } from "pinia";
import { ref } from "vue";

const useCommonStore = defineStore("common", () => {
  const isThemeDrawerOpen = ref(false);

  const getIsThemeDrawerOpen = () => {
    return isThemeDrawerOpen.value;
  };

  const setIsThemeDrawerOpen = (isOpen: boolean) => {
    isThemeDrawerOpen.value = isOpen;
  };

  return {
    isThemeDrawerOpen,
    getIsThemeDrawerOpen,
    setIsThemeDrawerOpen,
  };
});

export default useCommonStore;
