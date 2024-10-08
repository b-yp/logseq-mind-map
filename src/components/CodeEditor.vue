<template>
  <input type="checkbox" class="modal-toggle" :checked="isOpen" />
  <div class="modal" role="dialog" @click="onClose">
    <div class="modal-box flex flex-col items-end" @click="stopPropagation">
      <div id="code-editor-container" class="h-[500px] w-full rounded-md overflow-hidden"></div>
      <button class="btn btn-outline btn-sm mt-2" @click="handleSave">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, watch } from "vue";

const props = defineProps<{
  value: string;
  language: string;
  theme: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string, language: string) => void;
}>();

onMounted(() => {
  const container = document.getElementById("code-editor-container");
  return monaco.editor.create(container as HTMLElement, {
    value: props.value,
    language: props.language,
    theme: props.theme
  });
});

watch(
  () => props.language,
  () => {
    const editor = monaco.editor.getEditors()[0] as monaco.editor.IStandaloneCodeEditor;
    monaco.editor.setModelLanguage(editor.getModel() as monaco.editor.IModel, props.language.toLowerCase());
  }
);

watch(
  () => props.theme,
  (newVal) => {
    monaco.editor.setTheme(newVal);
  }
);

watch(
  () => props.value,
  (newVal) => {
    const editor = monaco.editor.getEditors()[0] as monaco.editor.IStandaloneCodeEditor;
    editor.setValue(newVal);
  }
);

const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation();
};

const handleSave = () => {
  const editor = monaco.editor.getEditors()[0];
  const value = editor.getValue();
  props.onSave(value, props.language);
};
</script>
