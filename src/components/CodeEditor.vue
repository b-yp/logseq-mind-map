<template>
  <input type="checkbox" class="modal-toggle" :checked="isOpen" />
  <div class="modal" role="dialog" @click="onClose">
    <div class="modal-box flex flex-col items-end" @click="stopPropagation">
      <div
        v-if="isWeb"
        id="code-editor-container"
        class="h-[500px] w-full rounded-md overflow-hidden"
      ></div>
      <Codemirror 
        v-else 
        :value="value" 
        :options="{mode: `${props.language.toLowerCase()}`, theme: props.isDarkUI ? 'dracula' : 'default'}" 
        border 
        :height="500"
        @change="handleChange"
      />
      <button class="btn btn-outline btn-sm mt-2" @click="handleSave">
        Save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { computed, onMounted, ref, watch } from "vue";
import Codemirror from "codemirror-editor-vue3";
import "codemirror"
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/vue/vue.js"
import "codemirror/mode/jsx/jsx.js"
import "codemirror/mode/python/python.js"
import "codemirror/theme/dracula.css";

const props = defineProps<{
  value: string;
  language: string;
  isDarkUI: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string, language: string) => void;
}>();

const content = ref("");

onMounted(() => {
  if (isWeb.value) {
    const container = document.getElementById("code-editor-container");
    return monaco.editor.create(container as HTMLElement, {
      value: props.value,
      language: props.language,
      theme: props.isDarkUI ? "vs-dark" : "vs",
    });
  }
});

watch(
  () => props.language,
  () => {
    if (!isWeb.value) return;
    const editor =
      monaco.editor.getEditors()[0] as monaco.editor.IStandaloneCodeEditor;
    monaco.editor.setModelLanguage(
      editor.getModel() as monaco.editor.IModel,
      props.language.toLowerCase()
    );
  }
);

watch(
  () => props.isDarkUI,
  (newVal) => {
    if (!isWeb.value) return;
    monaco.editor.setTheme(newVal ? "vs-dark" : "vs");
  }
);

watch(
  () => props.value,
  (newVal) => {
    if (!isWeb.value) return;
    const editor =
      monaco.editor.getEditors()[0] as monaco.editor.IStandaloneCodeEditor;
    editor.setValue(newVal);
  }
);

const isWeb = computed(() => import.meta.env.VITE_MODE === "web");

const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation();
};

const handleSave = () => {
  let value = content.value;
  if (isWeb.value) {
    const editor = monaco.editor.getEditors()[0];
    value = editor.getValue();
  }
  props.onSave(value, props.language);
};

const handleChange = (value: string) => {
  content.value = value;
};
</script>
