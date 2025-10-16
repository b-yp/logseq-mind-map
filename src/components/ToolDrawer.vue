<template>
  <Drawer
    :title="currentDrawer ? $t(`toolBar.${currentDrawer}`) : ''"
    :isOpen="isDrawerOpen"
    @close="onClose"
  >
    <Style v-if="currentDrawer === 'style'" />
    <Theme v-if="currentDrawer === 'theme'" />
    <Structure v-if="currentDrawer === 'structure'" />
    <Outline v-if="currentDrawer === 'outline'" :data="outlineData" />
    <Search v-if="currentDrawer === 'search'" />
    <Export v-if="currentDrawer === 'export'" />
    <Setting v-if="currentDrawer === 'setting'" />
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCommonStore, useMindMapStore } from "@/stores";

import Drawer from "./Drawer.vue";
import Style from "./Style.vue";
import Theme from "./Theme.vue";
import Structure from "./Structure.vue";
import Outline from "./Outline.vue";
import Search from "./Search.vue";
import Export from "./Export.vue";
import Setting from "./Setting.vue";

const commonStore = useCommonStore();
const mindMapStore = useMindMapStore();
const { setIsDrawerOpen, setCurrentDrawer } = commonStore;
const { isDrawerOpen, currentDrawer } = storeToRefs(commonStore);
const { data } = storeToRefs(mindMapStore);

const outlineData = computed(() => {
  return data.value ? [data.value] : [];
});

const onClose = () => {
  setIsDrawerOpen(false);
  setCurrentDrawer(null);
};
</script>
