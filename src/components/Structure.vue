<template>
  <div class="flex-1 overflow-y-auto mt-2">
    <div v-for="item in layoutList" :key="item"
      class="flex flex-col items-center gap-2 pb-2 mb-4 cursor-pointer rounded-md overflow-hidden border border-gray-200 hover:shadow-xl hover:border-gray-300"
      :class="{
        'border-indigo-600': layout === item,
        'hover:border-indigo-600': true,
      }" @click="useLayout(item)">
      <img class="h-auto w-[100px] h-[100px]" :src="structureImageMap[item].default" :alt="item" />
      <span>{{ $t(`structure.${item}`) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMindMapStore } from "@/stores";
import { layoutList, structureImageMap } from "@/config/structures";

const mindMapStore = useMindMapStore();
const { setLayout } = mindMapStore;
const { mindMap, layout } = storeToRefs(mindMapStore);

const useLayout = (item) => {
  setLayout(item);
  mindMap.value?.setLayout(item);
};
</script>
