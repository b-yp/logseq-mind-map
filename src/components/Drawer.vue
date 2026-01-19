<template>
  <div
    class="drawer drawer-end fixed top-1/2 right-0 h-[80vh] -translate-y-1/2"
    :class="{ 'drawer-open': isOpen, 'pointer-events-none': !isOpen }"
    :style="{ width: isOpen ? '20vw' : '0' }"
  >
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side z-50 h-full shadow-xl rounded-l-xl">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div class="card bg-base-100 w-[20vw] h-full">
        <div class="card-body h-full p-6">
          <div
            class="card-actions justify-between border-b border-gray-200 pb-2"
          >
            <h2 class="text-xl font-bold">{{ title }}</h2>
            <button
              class="btn btn-square btn-sm"
              @click="onClose"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
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
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  onClose: () => void;
}>();

const { isOpen, title, onClose } = toRefs(props);
console.log('isOpen', isOpen.value) 

watch(isOpen, () => {
  console.log('isOpen', isOpen.value) 
})  
</script>
