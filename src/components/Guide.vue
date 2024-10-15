<template>
  <Dialog :is-open="isFetchFailed" :title="$t('webGuide.title')">
    <ul class="mt-4">
      <li class="mb-4">
        <h3>1. {{ $t("webGuide.setting.1") }}</h3>
        <img class="ml-4" src="@/assets/images/screenshots/set-1.png" alt="1" />
      </li>
      <li class="mb-4">
        <h3>2. {{ $t("webGuide.setting.2") }}</h3>
        <img class="ml-4" src="@/assets/images/screenshots/set-2.png" alt="2" />
      </li>
      <li class="mb-4">
        <h3>3. {{ $t("webGuide.setting.3") }}</h3>
        <img class="ml-4" src="@/assets/images/screenshots/set-3.png" alt="3" />
      </li>
      <li class="mb-4">
        <h3>4. {{ $t("webGuide.setting.4") }}</h3>
        <img class="ml-4" src="@/assets/images/screenshots/set-4.png" alt="4" />
      </li>
    </ul>
  </Dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useCommonStore } from "@/stores";
import Dialog from "./Dialog.vue";

const commonStore = useCommonStore();
const { isFetchFailed } = storeToRefs(commonStore);
</script>
