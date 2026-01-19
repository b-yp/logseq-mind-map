<template>
  <div v-if="isWeb">
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
  </div>

  <div class="divider">{{ $t('setting.sensitivity') }}</div>

  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">{{ $t('setting.zoomSensitivity') }} ({{ scaleRatio }})</span>
    </div>
    <input
      type="range"
      min="0.05"
      max="1.0"
      step="0.05"
      class="range range-xs range-info"
      v-model.number="scaleRatio"
      @change="saveSensitivity"
    />
  </label>

  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">{{ $t('setting.panSensitivity') }} ({{ translateRatio }})</span>
    </div>
    <input
      type="range"
      min="0.1"
      max="2.0"
      step="0.1"
      class="range range-xs range-info"
      v-model.number="translateRatio"
      @change="saveSensitivity"
    />
  </label>

  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">{{ $t('setting.mousewheelStep') }} ({{ mousewheelMoveStep }})</span>
    </div>
    <input
      type="range"
      min="50"
      max="1000"
      step="50"
      class="range range-xs range-info"
      v-model.number="mousewheelMoveStep"
      @change="saveSensitivity"
    />
  </label>

  <div class="flex justify-end mt-4" v-if="isWeb">
    <button class="btn btn-info btn-sm" @click="handleSave">
      {{ $t("setting.save") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";

import Icon from "@/components/Icon.vue";
import { useLogseqStore, useCommonStore } from "@/stores";
import { showToast } from "@/utils";

const logseqStore = useLogseqStore();
const commonStore = useCommonStore();
const { logseqHost, logseqToken } = storeToRefs(logseqStore);
const { isWeb, scaleRatio: storeScaleRatio, translateRatio: storeTranslateRatio, mousewheelMoveStep: storeMousewheelMoveStep } = storeToRefs(commonStore);
const { setLogseqHost, setLogseqToken, setScaleRatio, setTranslateRatio, setMousewheelMoveStep } = logseqStore;
const { setScaleRatio: setCommonScaleRatio, setTranslateRatio: setCommonTranslateRatio, setMousewheelMoveStep: setCommonMousewheelMoveStep } = commonStore;

const host = ref(logseqHost.value);
const token = ref(logseqToken.value);

// Local refs bound to v-model for sliders
const scaleRatio = ref(storeScaleRatio.value);
const translateRatio = ref(storeTranslateRatio.value);
const mousewheelMoveStep = ref(storeMousewheelMoveStep.value);

const handleSave = () => {
  setLogseqHost(host.value);
  setLogseqToken(token.value);
  showToast("Saved", "success");
};

const saveSensitivity = () => {
  setCommonScaleRatio(scaleRatio.value);
  setCommonTranslateRatio(translateRatio.value);
  setCommonMousewheelMoveStep(mousewheelMoveStep.value);
  // Auto-save behavior for sliders, no toast needed for every drag
};
</script>
