<template>
  <div class="z-50 fixed right-5 top-1/2 transform -translate-y-1/2"
    :class="{ 'right-[21vw]': getIsDrawerOpen(), 'right-0': !getIsDrawerOpen() }">
    <ul class="menu menu-sm bg-base-200 rounded-box gap-2">
      <li v-for="item in toolBarData" :key="item.key" for="my-drawer-4" @click="item.onclick">
        <div class="flex flex-col items-center gap-2" :class="{ 'bg-gray-200': item.key === getCurrentDrawer() }">
          <Icon :name="item.icon" />
          <span>{{ $t(item.title) }}</span>
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
const { getIsDrawerOpen, getCurrentDrawer, setIsDrawerOpen, setCurrentDrawer } = commonStore;

const toolBarData = ref([
  {
    key: "theme",
    icon: "theme",
    title: "toolBar.theme",
    onclick: () => {
      setIsDrawerOpen(true);
      setCurrentDrawer("theme");
    },
  },
  {
    key: "structure",
    icon: "structure",
    title: "toolBar.structure",
    onclick: () => {
      setIsDrawerOpen(true);
      setCurrentDrawer("structure");
    },
  },
]);
</script>
