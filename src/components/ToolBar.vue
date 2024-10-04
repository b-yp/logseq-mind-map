<template>
  <div class="z-50 fixed right-5 top-1/2 transform -translate-y-1/2"
    :class="{ 'right-[21vw]': isDrawerOpen, 'right-0': !isDrawerOpen }">
    <ul class="menu menu-sm bg-base-200 rounded-box gap-2">
      <li v-for="item in toolBarData" :key="item.key" for="my-drawer-4" @click="item.onclick">
        <div class="flex flex-col items-center gap-2" :class="{ 'bg-gray-200': item.key === currentDrawer }">
          <Icon :name="item.icon" />
          <span>{{ $t(item.title) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useCommonStore } from "@/stores";

import Icon from "./Icon.vue";

const commonStore = useCommonStore();
const { setIsDrawerOpen, setCurrentDrawer } = commonStore;
const { isDrawerOpen, currentDrawer } = storeToRefs(commonStore);

const toolBarData = [
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
  {
    key: "outline",
    icon: "outline",
    title: "toolBar.outline",
    onclick: () => {
      setIsDrawerOpen(true);
      setCurrentDrawer("outline");
    },
  },
  {
    key: "search",
    icon: "search",
    title: "toolBar.search",
    onclick: () => {
      setIsDrawerOpen(true);
      setCurrentDrawer("search");
    },
  },
];
</script>
