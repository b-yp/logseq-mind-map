<template>
  <svg :class="`icon ${className}`" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  name: string;
  className?: string;
}>();

const name = ref(props.name);
const className = ref(props.className);
</script>

<style scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
