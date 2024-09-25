<script lang="ts" setup>
const close = () => {
  logseq.hideMainUI();
};
</script>

<template>
  <div>
    <button @click="close">Close</button>
    <h1>Hello World</h1>
  </div>
</template>
