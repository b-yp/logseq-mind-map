<template>
  <div class="flex-1 overflow-y-auto">
    <div class="collapse  collapse-minus bg-base-200" v-if="data?.length || 0 > 0" v-for="item in data"
      :key="item.data.uid">
      <input type="checkbox" @click="handleClick(item.data.uid || '')" />
      <div class="collapse-title border-b border-gray-300">{{ item.data.text
        }}
      </div>
      <div v-if="item.children?.length" class="collapse-content">
        <Outline :data="item.children" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMindMapStore } from "@/stores";
import { storeToRefs } from "pinia";
const props = defineProps<{
  data: IMindMap.Data[]
}>()

const { data } = props;
const mindMapStore = useMindMapStore();
const { mindMap } = storeToRefs(mindMapStore);

const handleClick = (uid: string) => {
  mindMap.value?.execCommand('GO_TARGET_NODE', uid)
}
</script>
