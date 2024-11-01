<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div v-if="imageUrl" class="relative w-full h-32">
      <img :src="imageUrl" class="w-full h-full object-cover rounded" />
      <button
        @click="handleDelete"
        class="btn btn-circle btn-outline btn-xs absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div
      v-else
      class="w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500"
      @click="triggerUpload"
    >
      <span class="text-gray-500">{{ $t('imageUploader.upload') }}</span>
    </div>

    <input
      ref="fileInput"
      type="file"
      @change="handleChangeImage"
      accept="image/*"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  modelValue?: string;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref(props.modelValue || "");

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleChangeImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
      emit("update:modelValue", imageUrl.value);
    };
    reader.readAsDataURL(file);
  }
};

const handleDelete = () => {
  imageUrl.value = "";
  emit("update:modelValue", "");
  if (fileInput.value) {
    fileInput.value.value = "";
    emit("update:modelValue", "");
  }
};
</script>
