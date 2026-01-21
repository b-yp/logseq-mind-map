<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="search flex items-center gap-2 p-2 border-b border-base-200 shrink-0">
      <input 
        class="input input-bordered input-sm flex-1 min-w-0 px-2" 
        :placeholder="$t('toolBar.search')" 
        ref="searchInputRef"
        v-model="searchText"
        @input="handleInput" 
        @keydown.stop 
      />
    </div>
    
    <div class="flex-1 overflow-y-auto p-1">
      <ul v-if="searchResults.length" class="space-y-0.5">
        <li v-for="item in searchResults" :key="item.uid">
          <div 
            class="group flex items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-base-200/50 cursor-pointer"
            @click="handleClick(item.uid)"
          >
             <span class="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
             <span 
               class="flex-1 truncate text-xs text-base-content/80 group-hover:text-base-content select-none leading-tight" 
               :title="item.text"
             >
               {{ item.text }}
             </span>
          </div>
        </li>
      </ul>
      <div v-else-if="searchText" class="text-center text-xs text-base-content/50 py-4">
        {{ $t('search.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useMindMapStore } from "@/stores";

const { t } = useI18n();
const mindMapStore = useMindMapStore();
const { mindMap, data } = storeToRefs(mindMapStore);

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchText = ref("");
const searchResults = shallowRef<Array<{ text: string, uid: string }>>([]);

// Helper to fully traverse and find matching nodes
const searchInTree = (nodes: IMindMap.Data[], query: string): Array<{ text: string, uid: string }> => {
  const result: Array<{ text: string, uid: string }> = [];
  const lowerQuery = query.toLowerCase();

  const traverse = (list: IMindMap.Data[]) => {
    for (const item of list) {
       const text = item.data.text || '';
       // Add to result if matches
       if (text.toLowerCase().includes(lowerQuery)) {
          result.push({ text, uid: item.data.uid! });
       }
       // Continue traversal for children regardless of match
       if (item.children && item.children.length > 0) {
         traverse(item.children);
       }
    }
  }

  traverse(nodes);
  return result;
}

const handleInput = () => {
  const query = searchText.value.trim();
  
  if (!query) {
    searchResults.value = [];
    if (mindMap.value) (mindMap.value as any).search.end();
    return;
  }

  // 1. Local search for result list
  if (data.value) {
     searchResults.value = searchInTree([data.value], query);
  } else {
     searchResults.value = [];
  }
  
  // 2. Canvas search for highlighting
  if (mindMap.value) {
      (mindMap.value as any).search.search(query, () => {});
  }
}

const handleClick = (uid: string) => {
  mindMap.value?.execCommand('GO_TARGET_NODE', uid);
}
</script>