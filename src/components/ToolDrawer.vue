<template>
  <Drawer :title="$t(`toolBar.${currentDrawer}`)" :isOpen="isDrawerOpen" @close="onClose">
    <Theme v-if="currentDrawer === 'theme'" />
    <Structure v-if="currentDrawer === 'structure'" />
  </Drawer>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores";

import Drawer from "./Drawer.vue";
import Theme from "./Theme.vue";
import Structure from "./Structure.vue";
import { storeToRefs } from "pinia";

const commonStore = useCommonStore();
const { setIsDrawerOpen, setCurrentDrawer } = commonStore;
const { isDrawerOpen, currentDrawer } = storeToRefs(commonStore)

const onClose = () => {
  setIsDrawerOpen(false);
  setCurrentDrawer(null);
};
</script>
