<template>
  <div class="flex-1 overflow-y-auto mt-2">
    <div v-for="item in exportList" :key="item.type"
      class="w-full flex items-center gap-4 p-5 mb-4 cursor-pointer rounded-md overflow-hidden border border-gray-200 hover:shadow-xl hover:border-gray-300"
      :class="{
        'border-indigo-600': exportType === item.type,
        'hover:border-indigo-600': true,
      }" @click="handleExport(item.type)">
      <Icon :name="item.icon" style="width: 60px; height: 60px;" />
      <div class="flex flex-col gap-2">
        <span class="text-lg font-bold">{{ $t(`${item.title}`) }}</span>
        <span class="text-sm text-gray-500">{{ $t(`${item.description}`) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMindMapStore } from '@/stores';

import Icon from './Icon.vue';

const mindMapStore = useMindMapStore();
const { mindMap, data } = storeToRefs(mindMapStore);

const exportType = ref('json');

const exportList = [
  {
    title: 'export.image.title',
    description: 'export.image.description',
    icon: 'image',
    type: 'png',
  },
  {
    title: 'export.svg.title',
    description: 'export.svg.description',
    icon: 'svg',
    type: 'svg',
  },
  {
    title: 'export.pdf.title',
    description: 'export.pdf.description',
    icon: 'pdf',
    type: 'pdf',
  }
]

const handleExport = (type: string) => {
  const title = data.value?.data?.text;
  mindMap.value?.export(type, true, title).then((res) => {
    console.log('res', res);
  });
}
</script>
