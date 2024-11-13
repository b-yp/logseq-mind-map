<template>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Logseq Server Host</span>
    </div>
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="link" />
      <input
        type="text"
        class="grow"
        placeholder="(e.g. http://127.0.0.1:12315)"
        v-model="host"
      />
    </label>
  </label>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Logseq Authorization Token</span>
    </div>
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="key" />
      <input
        type="text"
        class="grow"
        placeholder="(e.g. mind-map)"
        v-model="token"
      />
    </label>
  </label>
  <div class="flex justify-end">
    <button class="btn btn-info btn-sm" @click="handleSave">
      {{ $t("setting.save") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import Icon from "@/components/Icon.vue";
import { useLogseqStore } from "@/stores";
import { ref } from "vue";
import { showToast } from "@/utils";

const logseqStore = useLogseqStore();
const { logseqHost, logseqToken } = storeToRefs(logseqStore);
const { setLogseqHost, setLogseqToken } = logseqStore;

const host = ref(logseqHost.value);
const token = ref(logseqToken.value);

const handleSave = () => {
  setLogseqHost(host.value);
  setLogseqToken(token.value);
  showToast("Saved", "success");
};
</script>
