<template>
  <div class="flex-1 overflow-y-auto">
    <div
      class="collapse collapse-arrow border-base-300 bg-base-200 border mb-2"
    >
      <input type="checkbox" checked class="peer" />
      <div class="collapse-title">
        {{ $t("style.background") }}
      </div>
      <div class="collapse-content ml-2">
        <div role="tablist" class="tabs tabs-bordered">
          <a
            v-for="item in backgroundList"
            :key="item.key"
            role="tab"
            class="tab"
            :class="{ 'tab-active': activeName === item.key }"
            @click="activeName = item.key"
          >
            {{ $t(item.name) }}
          </a>
        </div>
        <div class="background-container flex items-center justify-center p-2">
          <input
            v-if="activeName === 'color'"
            class="w-full h-16"
            type="color"
            v-model="themeConfig.backgroundColor"
            @input="handleChangeColor"
          />
          <ImageUploader
            v-if="activeName === 'image'"
            v-model="themeConfig.backgroundImage"
            @update:modelValue="handleChangeImage"
          />
        </div>
      </div>
    </div>

    <div
      class="collapse collapse-arrow border-base-300 bg-base-200 border mb-2"
    >
      <input type="checkbox" checked class="peer" />
      <div class="collapse-title">
        {{ $t("style.line") }}
      </div>
      <div class="collapse-content ml-2">
        <ul>
          <li class="flex items-center justify-between mb-2">
            <span>{{ $t("style.color") }}</span>
            <input
              class="w-20 h-8"
              type="color"
              v-model="themeConfig.lineColor"
              @input="handleChangeLineColor"
            />
          </li>
          <li class="flex items-center justify-between mb-2">
            <span>{{ $t("style.width") }}</span>
            <select
              class="select select-bordered select-xs w-20"
              v-model="themeConfig.lineWidth"
              @change="handleChangeLineWidth"
            >
              <option v-for="i in 6" :value="i">{{ i }}</option>
            </select>
          </li>
          <li class="flex items-center justify-between mb-2">
            <span>{{ $t("style.style") }}</span>
            <select
              class="select select-bordered select-xs w-20"
              v-model="themeConfig.lineStyle"
              @change="handleChangeLineStyle"
            >
              <option value="straight">{{ $t("style.straight") }}</option>
              <option value="curve">{{ $t("style.curve") }}</option>
              <option value="direct">{{ $t("style.direct") }}</option>
            </select>
          </li>
          <li class="flex items-center justify-between">
            <span>{{ $t("style.showArrow") }}</span>
            <input
              type="checkbox"
              class="toggle"
              :style="{
                borderColor: themeConfig.lineColor,
                backgroundColor: themeConfig.lineColor,
              }"
              :checked="themeConfig.showLineMarker"
              @change="handleChangeShowLineMarker"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

import { useMindMapStore } from "@/stores";
import ImageUploader from "./ImageUploader.vue";

const mindMapStore = useMindMapStore();
const { mindMap, themeConfig } = storeToRefs(mindMapStore);
const { setThemeConfig } = mindMapStore;

const backgroundList = ref([
  {
    key: "color",
    name: "style.color",
    value: "color",
  },
  {
    key: "image",
    name: "style.image",
    value: "image",
  },
]);
const activeName = ref("color");

watch(themeConfig, (newConfig) => {
  mindMap.value?.setThemeConfig(newConfig);
});

const handleChangeColor = (e) => {
  const color = e.target.value;
  updateThemeConfig({ backgroundColor: color });
};

const handleChangeImage = (image: string) => {
  updateThemeConfig({ backgroundImage: image });
};

const handleChangeLineColor = (e) => {
  const color = e.target.value;
  updateThemeConfig({ lineColor: color, showLineMarker: true });
};

const handleChangeLineWidth = (e) => {
  const width = Number(e.target.value);
  updateThemeConfig({ lineWidth: width });
};

const handleChangeLineStyle = (e) => {
  const style = e.target.value;
  updateThemeConfig({ lineStyle: style });
};

const handleChangeShowLineMarker = (e) => {
  updateThemeConfig({ showLineMarker: e.target.checked });
};

const updateThemeConfig = (config: IMindMap.ThemeConfig) => {
  setThemeConfig({ ...themeConfig.value, ...config });
};
</script>
