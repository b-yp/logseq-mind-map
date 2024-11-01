<template>
  <div class="collapse border-base-300 bg-base-200 border">
    <input type="checkbox" class="peer" />
    <div class="collapse-title">
      {{ $t("style.background") }}
    </div>
    <div class="collapse-content">
      <div role="tablist" class="tabs tabs-bordered">
        <a
          v-for="item in backgroundList"
          :key="item.key"
          role="tab"
          class="tab"
          :class="{ 'tab-active': activeName === item.key }"
          @click="handleBackgroundTabClick(item.key)"
        >
          {{ $t(item.name) }}
        </a>
      </div>
      <div class="background-container flex items-center justify-center p-2">
        <input
          v-if="activeName === 'color'"
          class="w-full h-32"
          type="color"
          v-model="backgroundColor"
          @input="handleChangeColor"
        />
        <ImageUploader
          v-if="activeName === 'image'"
          v-model="backgroundImage"
          @update:modelValue="handleChangeImage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";

import { useMindMapStore } from "@/stores";
import ImageUploader from "./ImageUploader.vue";

const mindMapStore = useMindMapStore();
const { mindMap, backgroundColor, backgroundImage } = storeToRefs(mindMapStore);
const { setBackgroundColor, setBackgroundImage } = mindMapStore;

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

const handleBackgroundTabClick = (name: string) => {
  activeName.value = name;
  const property = name === "color" ? "backgroundColor" : "backgroundImage";
  const value =
    name === "color" ? backgroundColor.value : backgroundImage.value;
  updateBackground(property, value);
};

const handleChangeColor = (e) => {
  const color = e.target.value;
  updateBackground("backgroundColor", color);
  setBackgroundColor(color);
};

const handleChangeImage = (image: string) => {
  updateBackground("backgroundImage", image);
  setBackgroundImage(image);
};

const updateBackground = (property: string, value: string) => {
  mindMap.value?.setThemeConfig({ [property]: value });
};
</script>
