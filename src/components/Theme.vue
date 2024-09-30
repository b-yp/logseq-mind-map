<template>
  <div
    class="drawer drawer-end fixed top-1/2 right-0 h-[80vh] -translate-y-1/2"
    :class="{ 'drawer-open': getIsThemeDrawerOpen() }"
    :style="{ width: getIsThemeDrawerOpen() ? '20vw' : '0' }"
  >
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side z-50 h-full shadow-xl rounded-l-xl">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div class="card bg-base-100 w-[20vw] h-full">
        <div class="card-body h-full p-6">
          <div
            class="card-actions justify-between border-b border-gray-200 pb-2"
          >
            <h2 class="text-xl font-bold">{{ $t("theme.title") }}</h2>
            <button
              class="btn btn-square btn-sm"
              @click="setIsThemeDrawerOpen(false)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div role="tablist" class="tabs tabs-bordered">
            <a
              v-for="item in groupList"
              :key="item.name"
              role="tab"
              class="tab"
              :class="{ 'tab-active': activeName === item.name }"
              @click="handleTabClick(item.name)"
              >{{ item.name }}</a
            >
          </div>
          <div class="flex-1 overflow-y-auto mt-2">
            <div
              v-for="item in currentList"
              :key="item.value"
              class="flex flex-col items-center gap-2 pb-2 mb-4 cursor-pointer rounded-md overflow-hidden border border-gray-200 hover:shadow-xl hover:border-gray-300"
              @click="useTheme(item)"
            >
              <img class="h-auto" :src="themeMap[item.value]" alt="" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { themeList as themeListData } from "simple-mind-map/src/constants/constant";

import { themeMap, baiduThemes } from "@/config/theme";
import { useMindMapStore, useCommonStore } from "@/stores";

const { t } = useI18n();

const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { getMindMap } = mindMapStore;
const { getIsThemeDrawerOpen, setIsThemeDrawerOpen } = commonStore;

interface Theme {
  name: string;
  value: string;
  dark: boolean;
}

const themeList = ref<Theme[]>(themeListData);
const groupList = ref<{ name: string; list: Theme[] }[]>([]);
const activeName = ref("");
const theme = ref("");

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
  theme.value = mindMap?.getTheme() || "";
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
      name: t("theme.classics"),
      list: classicsList,
    },
    {
      name: t("theme.dark"),
      list: themeList.value.filter((item) => {
        return item.dark;
      }),
    },
    {
      name: t("theme.simple"),
      list: baiduList,
    },
  ];
  activeName.value = groupList.value[0].name;
};

const handleTabClick = (groupName: string) => {
  activeName.value = groupName;
};

const useTheme = (currentTheme: Theme) => {
  if (currentTheme.value === theme.value) return;
  theme.value = currentTheme.value;
  const mindMap = getMindMap();
  if (!mindMap) return;
  mindMap.setTheme(currentTheme.value);
};
</script>
