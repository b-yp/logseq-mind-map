<template>
  <div role="tablist" class="tabs tabs-bordered">
    <a v-for="item in groupList" :key="item.name" role="tab" class="tab"
      :class="{ 'tab-active': activeName === item.name }" @click="handleTabClick(item.name)">{{ $t(item.name) }}</a>
  </div>
  <div class="flex-1 overflow-y-auto mt-2">
    <div v-for="item in currentList" :key="item.value"
      class="flex flex-col items-center gap-2 pb-2 mb-4 cursor-pointer rounded-md overflow-hidden border border-gray-200 hover:shadow-xl hover:border-gray-300"
      :class="{
        'border-indigo-600': getTheme() === item.value,
        'hover:border-indigo-600': getTheme() === item.value,
      }" @click="useTheme(item)">
      <img class="h-auto" :src="themeImageMap[item.value].default" :alt="item.name" />
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { themeList as themeListData } from "simple-mind-map/src/constants/constant";

import { themeImageMap, baiduThemes } from "@/config/theme";
import { useMindMapStore, useCommonStore } from "@/stores";

const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { getMindMap, getTheme, setTheme } = mindMapStore;
const { setIsDarkUI } = commonStore;

interface Theme {
  name: string;
  value: string;
  dark: boolean;
}

const themeList = ref<Theme[]>(themeListData);
const groupList = ref<{ name: string; list: Theme[] }[]>([]);
const activeName = ref("");

const currentList = computed(() => {
  return (
    groupList.value.find((item) => item.name === activeName.value)?.list || []
  );
});

onMounted(() => {
  initGroup();
});

watch(getMindMap, () => {
  const mindMap = getMindMap();
  setTheme(mindMap?.getTheme() || "");
});

watch(getTheme, () => {
  const mindMap = getMindMap();
  if (!mindMap) return;
  mindMap.setTheme(getTheme());
});

const initGroup = () => {
  let baiduList: Theme[] = [];
  let classicsList: Theme[] = [];
  themeList.value.forEach((item) => {
    if (baiduThemes.includes(item.value)) {
      baiduList.push(item);
    } else if (!item.dark) {
      classicsList.push(item);
    }
  });
  groupList.value = [
    {
      name: "theme.classics",
      list: classicsList,
    },
    {
      name: "theme.dark",
      list: themeList.value.filter((item) => item.dark),
    },
    {
      name: "theme.simple",
      list: baiduList,
    },
  ];
  activeName.value = groupList.value[0].name;
};

const handleTabClick = (groupName: string) => {
  activeName.value = groupName;
};

const useTheme = (currentTheme: Theme) => {
  const theme = getTheme();
  if (currentTheme.value === theme) return;
  setTheme(currentTheme.value);
  setDark(currentTheme.dark)
};

const setDark = (isDark: boolean) => {
  setIsDarkUI(isDark);
};
</script>
