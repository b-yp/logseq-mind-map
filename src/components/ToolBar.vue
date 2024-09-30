<template>
  <div
    class="z-50 fixed right-5 top-1/2 transform -translate-y-1/2"
    :class="{ 'right-[20vw]': getIsThemeDrawerOpen() }"
  >
    <ul class="menu menu-sm bg-base-200 rounded-box">
      <li
        v-for="item in toolBarData"
        :key="item.icon"
        for="my-drawer-4"
        @click="item.onclick"
      >
        <div class="flex flex-col items-center gap-2">
          <Icon :name="item.icon" />
          <span>{{ item.title }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useCommonStore } from "@/stores";

import Icon from "./Icon.vue";

const commonStore = useCommonStore();
const { getIsThemeDrawerOpen, setIsThemeDrawerOpen } = commonStore;

const toolBarData = ref([
  {
    icon: "theme",
    title: "主题",
    onclick: () => {
      setIsThemeDrawerOpen(true);
    },
  },
]);
</script>
