<template>
  <div class="search flex items-center gap-2">
    <input class="search-input border flex-1 px-2 py-1" placeholder="Search" ref="searchInputRef" @change="handleSearch"
      @input="handleInput" />
    <button class="btn btn-sm" @click="handleSearch">
      {{ searchText }}
      <svg t="1728031804017" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4285" width="18" height="18">
        <path
          d="M911.8 839.6L750.9 678.7c120.1-160.6 87.2-388.1-73.3-508.2s-388.1-87.2-508.2 73.3c-46.9 62.8-72.3 139-72.3 217.4 0 200.5 162.5 363.1 363.1 363.1 78.4 0 154.6-25.4 217.4-72.3l160.8 160.8c20.2 20.3 53.1 20.3 73.4 0.1 20.2-20.2 20.2-53.1 0-73.3z m-451.7-119c-143.2 2-260.9-112.4-263-255.6-2-143.2 112.4-260.9 255.6-263h7.3c143.2 0 259.3 116.1 259.3 259.3S603.4 720.6 460.1 720.6z"
          p-id="4286"></path>
      </svg>
    </button>
  </div>
  <div class="search-result mt-2" v-if="searchInfo.total > 0">
    {{ $t('search.current') }} {{ searchInfo.currentIndex + 1 }} / {{ $t('search.total') }} {{ searchInfo.total }}
  </div>
  <div class="search-result mt-2" v-else>
    {{ $t('search.empty') }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

import { useMindMapStore } from "@/stores";

const { t } = useI18n();
const mindMapStore = useMindMapStore();
const { mindMap, searchInfo } = storeToRefs(mindMapStore);

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchText = ref(t('toolBar.search'));

watch(searchInfo, () => {
  if (searchInfo.value.total === 0 || searchInfo.value.currentIndex + 1 === searchInfo.value.total) {
    searchText.value = t('toolBar.search');
  } else {
    searchText.value = t('search.next');
  }
})

const handleSearch = () => {
  const value = searchInputRef.value?.value
  if (!mindMap.value) return;
  (mindMap.value as any).search.search(value, () => {
    searchInputRef.value?.focus();
  })
}

const handleInput = () => {
  searchText.value = t('toolBar.search');
}
</script>