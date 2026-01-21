<template>
  <div class="flex-1 overflow-y-auto p-1">
    <ul v-if="data?.length" class="space-y-0.5">
      <li v-for="item in data" :key="item.data.uid">
        <div class="group flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors hover:bg-base-200/50 cursor-pointer">
          <!-- Expand/Collapse Button -->
          <button 
            v-if="item.children?.length"
            @click.stop="toggleExpand(item.data.uid!)"
            class="flex h-4 w-4 items-center justify-center rounded hover:bg-base-300 text-base-content/50 hover:text-base-content transition-transform duration-200"
            :class="{ 'rotate-90': isExpanded(item.data.uid!) }"
          >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
          <span v-else class="w-4"></span>

          <!-- Node Text -->
          <span 
            class="flex-1 truncate text-xs text-base-content/80 group-hover:text-base-content select-none leading-tight"
            @click="handleClick(item.data.uid || '')"
            :title="item.data.text"
          >
            {{ item.data.text }}
          </span>
        </div>

        <!-- Recursive Children -->
        <div v-if="item.children?.length && isExpanded(item.data.uid!)" class="ml-3 pl-1 border-l border-base-200/50 mt-0.5">
          <Outline :data="item.children" />
        </div>
      </li>
    </ul>
    <div v-else class="text-center text-xs text-base-content/50 py-4">
      No items
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMindMapStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps<{
  data: IMindMap.Data[]
}>()

const mindMapStore = useMindMapStore();
const { mindMap } = storeToRefs(mindMapStore);

// State for expanded nodes
const expandedNodes = ref<Set<string>>(new Set());

// Initialize all nodes as expanded by default (optional, can be changed)
if (props.data) {
  props.data.forEach(item => {
    if (item.data.uid && item.children?.length) {
       expandedNodes.value.add(item.data.uid);
    }
  });
}

const isExpanded = (uid: string) => expandedNodes.value.has(uid);

const toggleExpand = (uid: string) => {
  if (expandedNodes.value.has(uid)) {
    expandedNodes.value.delete(uid);
  } else {
    expandedNodes.value.add(uid);
  }
}

const handleClick = (uid: string) => {
  mindMap.value?.execCommand('GO_TARGET_NODE', uid)
}
</script>
