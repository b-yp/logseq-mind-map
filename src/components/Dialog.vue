<template>
  <div>
    <input
      :checked="props.isOpen"
      type="checkbox"
      id="modal"
      class="modal-toggle"
    />
    <div class="modal" role="dialog">
      <div class="modal-box">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            @click="handleClose"
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
const props = defineProps<{
  title: string;
  isOpen: boolean;
}>();
const emit = defineEmits(["close"]);

const handleClose = () => emit("close");
</script>
