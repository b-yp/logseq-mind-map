<template>
  <div class="fixed top-5 right-5 flex gap-4">
    <div
      class="tooltip tooltip-bottom"
      :data-tip="$t('menu.refreshDescription')"
    >
      <button class="btn btn-outline btn-info btn-xs" @click="handleRefresh">
        {{ $t("menu.refresh") }}
      </button>
    </div>
    <div
      class="lang-toggle tooltip tooltip-bottom"
      :data-tip="$t('menu.language')"
    >
      <select
        class="select select-info select-xs max-w-xs"
        @change="changeLang"
      >
        <option disabled selected>Select language</option>
        <option v-for="lang in langs" :key="lang" :selected="lang === locale">
          {{ lang }}
        </option>
      </select>
    </div>
    <div class="tooltip tooltip-bottom" :data-tip="$t('menu.theme')">
      <div class="theme-toggle flex items-center gap-2">
        <span>🌞</span>
        <input
          class="toggle"
          type="checkbox"
          :checked="isDarkUI"
          @change="toggleTheme"
        />
        <span>🌚</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useCommonStore, useMindMapStore } from "@/stores";
import lang from "@/lang";
import { storeToRefs } from "pinia";

import { setData } from "@/main";

const { locale } = useI18n();

const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();

const { setTheme } = mindMapStore;
const { setIsDarkUI } = commonStore;
const { isDarkUI, isDrawerOpen } = storeToRefs(commonStore);
const { mindMap } = storeToRefs(mindMapStore);

const langs = Object.keys(lang);

const toggleTheme = () => {
  if (isDarkUI.value) {
    setIsDarkUI(false);
    setTheme("default");
    !isDrawerOpen.value && mindMap.value?.setTheme("default");
  } else {
    setIsDarkUI(true);
    setTheme("dark");
    !isDrawerOpen.value && mindMap.value?.setTheme("dark");
  }
};

const changeLang = (e: Event) => {
  const lang = (e.target as HTMLSelectElement).value;
  locale.value = lang;
  localStorage.setItem("localeValue", locale.value);
};

const handleRefresh = setData;
</script>
