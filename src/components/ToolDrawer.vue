<template>
  <Drawer :title="$t(`toolBar.${getCurrentDrawer()}`)" :isOpen="getIsDrawerOpen()" @close="onClose">
    <Theme v-if="getCurrentDrawer() === 'theme'" />
    <Structure v-if="getCurrentDrawer() === 'structure'" />
  </Drawer>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores";

import Drawer from "./Drawer.vue";
import Theme from "./Theme.vue";
import Structure from "./Structure.vue";

const commonStore = useCommonStore();
const { getIsDrawerOpen, getCurrentDrawer, setIsDrawerOpen, setCurrentDrawer } = commonStore;

const onClose = () => {
  setIsDrawerOpen(false);
  setCurrentDrawer(null);
};
</script>
