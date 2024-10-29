<template>
  <div v-show="isShowMenu">
    <ul
      v-show="rightClickType === 'node'"
      class="menu bg-base-200 rounded-box fixed"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
    >
      <li @click="handleInsertSiblingNode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.insertSiblingNode") }}</span>
          <kbd class="kbd kbd-sm">Enter</kbd>
        </div>
      </li>
      <li @click="handleInsertChildNode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.insertChildNode") }}</span>
          <kbd class="kbd kbd-sm">Tab</kbd>
        </div>
      </li>
      <div class="divider m-0"></div>
      <li @click="handleCollapseAllSiblingNode(true)">
        <span>{{ $t("rightMenu.collapseAllSiblingNode") }}</span>
      </li>
      <li @click="handleCollapseAllSiblingNode(false)">
        <span>{{ $t("rightMenu.collapseOtherSiblingNode") }}</span>
      </li>
      <li @click="handleCollapseOtherParentNode">
        <span>{{ $t("rightMenu.collapseOtherParentNode") }}</span>
      </li>
      <div class="divider m-0"></div>
      <li @click="handleRemoveNode">
        <div class="w-full flex items-center justify-between">
          <span class="text-error">{{ $t("rightMenu.deleteNode") }}</span>
          <kbd class="kbd kbd-sm">Delete</kbd>
        </div>
      </li>
      <li @click="handleRemoveCurrentNode">
        <div class="w-full flex items-center justify-between">
          <span class="text-error">{{
            $t("rightMenu.deleteCurrentNode")
          }}</span>
          <div>
            <kbd class="kbd kbd-sm">Shift</kbd>
            <span>+</span>
            <kbd class="kbd kbd-sm">Backspace</kbd>
          </div>
        </div>
      </li>
    </ul>

    <ul
      v-show="rightClickType === 'canvas'"
      class="menu bg-base-200 rounded-box fixed"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
    >
      <li @click="handleBackToRootNode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.backRootNode") }}</span>
          <div>
            <kbd class="kbd kbd-sm">Ctrl</kbd>
            <span>+</span>
            <kbd class="kbd kbd-sm">Enter</kbd>
          </div>
        </div>
      </li>
      <div class="divider m-0"></div>
      <li @click="handleExpandAll">
        <span>{{ $t("rightMenu.expandAll") }}</span>
      </li>
      <li @click="handleCollapseAll">
        <span>{{ $t("rightMenu.collapseAll") }}</span>
      </li>
      <div class="dropdown dropdown-hover dropdown-right">
        <li>
          <div class="w-full flex items-center justify-between" tabindex="0">
            <span>{{ $t("rightMenu.expandTo") }}</span>
            <Icon name="right" class="text-gray-500" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 -translate-x-4 shadow"
          >
            <li
              v-for="level in Array.from(
                { length: 6 },
                (_, index) => index + 1
              )"
              :key="level"
              @click="handleExpandToLevel(level)"
            >
              <a>
                {{ $t(`rightMenu.level${level}`) }}
              </a>
            </li>
          </ul>
        </li>
      </div>
      <div class="divider m-0"></div>
      <li @click="handleFitCanvas">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.fitCanvas") }}</span>
          <div>
            <kbd class="kbd kbd-sm">Ctrl</kbd>
            <span>+</span>
            <kbd class="kbd kbd-sm">I</kbd>
          </div>
        </div>
      </li>
      <li @click="handleZenMode">
        <div class="w-full flex items-center justify-between">
          <span>{{ $t("rightMenu.zenMode") }}</span>
          <Icon v-show="isZenMode" name="tick" class="text-gray-500" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import Icon from "@/components/Icon.vue";

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData, getNodesAtLevel } from "@/utils";

const logseqStore = useLogseqStore();
const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const {
  setLastNode,
  setIsZenMode,
  handleExpandToLevel,
  handleFitCanvas,
  handleRemoveCurrentNode,
  handleRemoveNode,
} = mindMapStore;
const { setIsShowMenu, setSyncNodeType } = commonStore;
const { trees, currentGraph } = storeToRefs(logseqStore);
const { mindMap, activeNode, isZenMode } = storeToRefs(mindMapStore);
const { rightClickType, menuLeft, menuTop, isShowMenu } =
  storeToRefs(commonStore);

const handleBackToRootNode = () => {
  mindMap.value?.renderer.setRootNodeCenter();
};

const handleExpandAll = () => {
  mindMap.value?.execCommand("EXPAND_ALL");
};

const handleCollapseAll = () => {
  mindMap.value?.execCommand("UNEXPAND_ALL");
};

const handleZenMode = () => {
  if (isZenMode.value) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
  setIsZenMode(!isZenMode.value);
};

const handleInsertSiblingNode = () => {
  mindMap.value?.execCommand("INSERT_NODE");
  setLastNode(activeNode.value);
  setSyncNodeType("sibling");
};

const handleInsertChildNode = () => {
  mindMap.value?.execCommand("INSERT_CHILD_NODE");
  setLastNode(activeNode.value);
  setSyncNodeType("children");
};

const handleCollapseAllSiblingNode = (isIncludeCurrentNode: boolean = true) => {
  const node = activeNode.value;
  if (!node) return;
  if (node.opt.layerIndex <= 6) return handleExpandToLevel(node.opt.layerIndex);
  const data = getData(trees.value, currentGraph.value!);
  const nodes = getNodesAtLevel(data, node.opt.layerIndex);
  const uids = isIncludeCurrentNode
    ? nodes.map((i) => i.uid)
    : nodes.map((i) => i.uid).filter((i) => i !== node.uid);
  uids.forEach((uid) => {
    mindMap.value?.execCommand("UNEXPAND_ALL", false, uid);
  });
  setIsShowMenu(false);
};

const handleCollapseOtherParentNode = () => {
  const node = activeNode.value;
  const getTopNodeUid = (node: any) => {
    if (node.opt.layerIndex === 1) return node.uid;
    return getTopNodeUid(node.parent);
  };
  const topNodeUid = getTopNodeUid(node);
  if (!topNodeUid) return;
  mindMap.value?.execCommand("UNEXPAND_ALL", false);
  // TODO: If it's an asynchronous task, a timer needs to be added.
  mindMap.value?.renderer.expandToNodeUid(node.uid, () => {
    mindMap.value?.execCommand("EXPAND_ALL", node.uid);
  });
};
</script>
