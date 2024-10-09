<template>
  <div>
    <input type="checkbox" :checked="isOpen" id="modal" class="modal-toggle" />
    <div class="modal" role="dialog">
      <div class="modal-box">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            @click="isOpen = false"
          >
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <div>
          <slot></slot>
        </div>
        <div class="modal-action">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  title: string;
  isOpen: boolean;
}>();

const isOpen = ref(props.isOpen);

watch(props, () => {
  isOpen.value = props.isOpen;
});
</script>
