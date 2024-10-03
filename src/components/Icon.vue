<template>
  <svg :class="`icon ${className}`" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
  name: string;
  className?: string;
}>();

const { name, className } = toRefs(props);
</script>

<style scoped>
  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
