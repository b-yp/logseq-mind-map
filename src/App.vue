<script lang="ts" setup>
import { onMounted, watch, ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import proxyLogseq from "logseq-proxy";
import hotkeys from "hotkeys-js";
import MindMap from "simple-mind-map";
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";
import Search from "simple-mind-map/src/plugins/Search.js";
import Export from "simple-mind-map/src/plugins/Export.js";
import ExportPDF from "simple-mind-map/src/plugins/ExportPDF.js";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

import { useLogseqStore, useMindMapStore, useCommonStore } from "@/stores";
import { getData, showToast, highlightCode, isMarkdown, renderMarkdown, applyMarkdownStyles, processLogseqSyntax } from "@/utils";
import SettingMenu from "@/components/SettingMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
import ToolDrawer from "@/components/ToolDrawer.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import Guide from "@/components/Guide.vue";
import RightMenu from "./components/RightMenu.vue";
import { setData as setDataMain } from "@/main";

const { locale } = useI18n();

MindMap.usePlugin(NodeImgAdjust);
MindMap.usePlugin(Search);
MindMap.usePlugin(Export);
MindMap.usePlugin(ExportPDF);

const logseqStore = useLogseqStore();
const mindMapStore = useMindMapStore();
const commonStore = useCommonStore();
const { setTrees } = logseqStore;
const {
  setMindMap,
  setData,
  setSearchInfo,
  setActiveNode,
  setLastNode,
  handleFitCanvas,
  handleRemoveCurrentNode,
  handleRemoveNode,
  setIsLoading,
} = mindMapStore;
const {
  setMainRef,
  handleCloseMenu,
  setSyncNodeType,
  setMenuLeft,
  setMenuTop,
  setIsShowMenu,
  setRightClickType,
} = commonStore;
const { page, trees, currentGraph, logseqHost, logseqToken } =
  storeToRefs(logseqStore);
const { mindMap, activeNode, lastNode, isZenMode, isLoading, themeConfig, theme, layout } =
  storeToRefs(mindMapStore);
const { isDarkUI, syncNodeType, lang, isWeb, scaleRatio, translateRatio, mousewheelMoveStep } = storeToRefs(commonStore);

const codeEditor = ref<{
  isOpen: boolean;
  language: string;
  content: string;
}>({
  isOpen: false,
  language: "",
  content: "",
});
const mainRef = ref<HTMLDivElement>();
const mouseDownX = ref<number>(0);
const mouseDownY = ref<number>(0);
const isMouseDown = ref<boolean>(false);

const uidMap = ref<Record<string, string>>({});
// Store context for the next created node
const pendingContext = ref<{
  type: "children" | "sibling";
  logseqUid: string;
} | null>(null);

// 更新所有 markdown 内容的颜色
const updateMarkdownColors = (textColor: string) => {
  // 限制查询范围到思维导图容器内
  const mindMapContainer = document.getElementById('mindMapContainer');
  if (!mindMapContainer) return;
  
  const markdownContainers = mindMapContainer.querySelectorAll('.markdown-content');
  markdownContainers.forEach((container) => {
    (container as HTMLElement).style.color = textColor;
  });
};

onMounted(() => {
  locale.value = lang.value;
  setTimeout(() => {
    const mindMapContainer = document.getElementById("mindMapContainer")!;
    const mind = new MindMap({
      el: mindMapContainer,
      // Disable svg check to prevent shortcuts from dying when focus shifts/overlays appear
      enableShortcutOnlyWhenMouseInSvg: false,
      isUseCustomNodeContent: true,
      customCreateNodeContent: (node) => {
        const nodeData = node.nodeData.data;
        codeEditor.value.content = nodeData.text;
        
        // 如果节点有自定义内容（Markdown 渲染后的内容），优先使用
        if (nodeData.customNodeContent) {
          // 为 markdown 内容添加双击编辑支持
          const container = nodeData.customNodeContent.cloneNode(true);
          container.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Markdown 节点双击事件触发');
            
            // 启动编辑模式
            if (mindMap.value && mindMap.value.renderer && mindMap.value.renderer.textEdit) {
              // 临时清除自定义内容，显示原始文本进行编辑
              nodeData.customNodeContent = null;
              nodeData.richText = false;
              
              // 强制重新渲染节点
              node.reRender();
              
              // 等待重新渲染完成后启动编辑
              setTimeout(() => {
                console.log('启动文本编辑');
                mindMap.value.renderer.textEdit.show({
                  node: node
                });
              }, 100);
            }
          });
          return container;
        }
        
        // 否则检查是否有代码块需要高亮
        return highlightCode(nodeData.text, ({ language, code }) => {
          codeEditor.value.isOpen = true;
          codeEditor.value.language = language;
          codeEditor.value.content = code;
        });
      },
      scaleRatio: scaleRatio.value,
      translateRatio: translateRatio.value,
      mousewheelMoveStep: mousewheelMoveStep.value,
    } as any);
    setMindMap(mind);
  }, 100);

  watch([scaleRatio, translateRatio, mousewheelMoveStep], () => {
    if (!mindMap.value) return;
    mindMap.value.opt.scaleRatio = scaleRatio.value;
    mindMap.value.opt.translateRatio = translateRatio.value;
    mindMap.value.opt.mousewheelMoveStep = mousewheelMoveStep.value;
  });

  hotkeys("esc", close);
});

onUnmounted(() => {
  hotkeys.unbind("esc", close);
  if (mindMap.value) {
    mindMap.value.off("node_tree_render_end", handleNodeTreeRenderEnd);
    mindMap.value.off("node_active", handleNodeActive);
    mindMap.value.off("hide_text_edit", handleHideTextEdit);
    mindMap.value.off("data_change", setData);
    mindMap.value.off("search_info_change", setSearchInfo);
    mindMap.value.off("node_contextmenu", handleNodeContextmenu);
    mindMap.value.off("node_click", handleCloseMenu);
    mindMap.value.off("draw_click", handleCloseMenu);
    mindMap.value.off("expand_btn_click", handleCloseMenu);
    mindMap.value.off("mousewheel", handleCloseMenu);
    mindMap.value.off("svg_mousedown", handleSvgMouseDown);
    mindMap.value.off("mouseup", handleMouseUp);
  }
});

// 数据更新函数
const updateMindMapData = async () => {
  if (!mindMap.value || !currentGraph.value) return;

  try {
    // 显示加载状态
    setIsLoading(true);
    
    // 先设置主题相关配置
    mindMap.value.setThemeConfig(themeConfig.value);
    mindMap.value.setLayout(layout.value);
    mindMap.value.setTheme(theme.value);
    
    // 使用 requestAnimationFrame 确保主题应用完成
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
    
    // 获取文本颜色
    const secondTheme = mindMap.value.getThemeConfig('second');
    const textColor = secondTheme?.color;
    
    // 等待数据加载完成
    const nodes = await getData(trees.value, currentGraph.value);
    
    // 更新数据
    mindMap.value.updateData({
      data: {
        text: page.value?.name,
        uid: page.value?.id,
      },
      children: nodes,
    });
    
    // 等待 DOM 更新后再更新颜色
    if (textColor) {
      // 使用多个 requestAnimationFrame 确保 DOM 完全更新
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateMarkdownColors(textColor);
        });
      });
    }
    
    uidMap.value = {};
    setTimeout(handleFitCanvas, 500);
  } catch (error) {
    console.error('Failed to load mind map data:', error);
  } finally {
    setIsLoading(false);
  }
};

watch([mindMap, page, trees, currentGraph, theme], updateMindMapData);

watch(mindMap, () => {
  if (!mindMap.value) return;
  mindMap.value.on("node_tree_render_end", handleNodeTreeRenderEnd);
  mindMap.value.on("node_active", handleNodeActive);
  mindMap.value.on("hide_text_edit", handleHideTextEdit);
  mindMap.value.on("data_change", setData);
  mindMap.value.on("search_info_change", setSearchInfo);
  mindMap.value.on("node_contextmenu", handleNodeContextmenu);
  mindMap.value.on("node_click", handleCloseMenu);
  mindMap.value.on("draw_click", handleCloseMenu);
  mindMap.value.on("expand_btn_click", handleCloseMenu);
  mindMap.value.on("mousewheel", handleCloseMenu);
  // mindMap.value.on("node_dblclick", handleNodeDoubleClick);
  mindMap.value.on("svg_mousedown", handleSvgMouseDown);
  mindMap.value.on("mouseup", handleMouseUp);

  mindMap.value.keyCommand.removeShortcut("Tab");
  mindMap.value.keyCommand.addShortcut("Tab", () => {
    if (!activeNode.value) {
      showToast("No active node for Tab", "warning");
      return;
    }
    const contextNode = activeNode.value;
    const contextUid = contextNode.getData().logseqUid || contextNode.getData().uid;
    
    // Set pending context for the soon-to-be-created node
    pendingContext.value = {
      type: "children",
      logseqUid: contextUid
    };

    setSyncNodeType("children"); 
    mindMap.value.execCommand('INSERT_CHILD_NODE');
  });

  mindMap.value.keyCommand.removeShortcut("Enter");
  mindMap.value.keyCommand.addShortcut("Enter", () => {
    if (!activeNode.value) {
      showToast("No active node for Enter", "warning");
      return;
    }
    const contextNode = activeNode.value;
    const contextUid = contextNode.getData().logseqUid || contextNode.getData().uid;
    
    // Set pending context for the soon-to-be-created node
    pendingContext.value = {
      type: "sibling",
      logseqUid: contextUid
    };
    
    setSyncNodeType("sibling");
    mindMap.value.execCommand('INSERT_NODE');
  });

  // TODO: There is a bug in continuous deletion.
  // @ts-ignore
  mindMap.value.keyCommand.removeShortcut("Del");
  mindMap.value.keyCommand.addShortcut("Del", handleRemoveNode);
  // @ts-ignore
  mindMap.value.keyCommand.removeShortcut("Shift+Backspace");
  mindMap.value.keyCommand.addShortcut(
    "Shift+Backspace",
    handleRemoveCurrentNode
  );
});

watch(mainRef, (ref) => {
  !!ref && setMainRef(ref);
});

watch([logseqHost, logseqToken, isWeb], () => {
  if (!isWeb.value) return;
  proxyLogseq({
    config: {
      apiServer: logseqHost.value,
      apiToken: logseqToken.value,
    },
    settings: window.mockSettings,
  });
  setDataMain();
});

const close = () => {
  if (codeEditor.value.isOpen) {
    codeEditor.value.isOpen = false;
    return;
  }
  if (import.meta.env.VITE_MODE === "web") return;
  logseq.hideMainUI();
};

const handleNodeTreeRenderEnd = () => {
  if (!mindMap.value) return;
  // handleFitCanvas();
};

const handleNodeActive = (res: any) => {
  res && setActiveNode(res);
  
  // Apply pending context if this is a newly created node
  if (res && pendingContext.value) {
      // Use direct assignment instead of setData to avoid re-render loop/focus loss
      // res.setData({ ... }) triggers SET_NODE_DATA command which re-renders node
      res.nodeData.data.customSyncType = pendingContext.value.type;
      res.nodeData.data.customContextUid = pendingContext.value.logseqUid;
      
      // Clear pending context
      pendingContext.value = null;
      
      // Force valid focus on the node's element if accessible
      // if (res.group) res.group.focus(); 
  }
};

const handleHideTextEdit = async () => {
  const node = activeNode.value;
  if (!node) return;
  const data = node.getData();
  
  // Use local node metadata if available, otherwise fall back to global state (legacy/editing)
  // Check for both 'customSyncType' and '_syncType' just in case, but prefer customSyncType
  const syncType = data.customSyncType || data._syncType || syncNodeType.value;
  let currentUid = data.customContextUid || data._contextLogseqUid;
  
  // Fallback: If no specific context UID, try current Logseq mapping or default parent logic
  if (!currentUid) {
      const lastNodeData = lastNode.value?.getData();
      currentUid = lastNodeData && (lastNodeData.logseqUid || uidMap.value[lastNodeData.uid] || lastNodeData.uid);
  }
  
  // CRITICAL: Resolve currentUid if it's a temporary internal ID
  // If we have a mapping for this ID in uidMap, use it!
  if (currentUid && uidMap.value[currentUid]) {
      currentUid = uidMap.value[currentUid];
  }

  // Remove metadata cleanup to prevent unnecessary re-renders that might disrupt focus
  // Sync type metadata is harmless to keep on the node temporarily

  if (["children", "sibling"].includes(syncType) && !currentUid) {
    showToast("Error: Target node context not found", "error");
    // Ensure we reset global state even on error
    setSyncNodeType("self");
    return;
  }

  let res: BlockEntity | boolean | null = null;
  try {
    switch (syncType) {
      case "self":
        // For updates, we use the node's own logseqUid if present, or its default uid
        const targetUid = data.logseqUid || data.uid;
        console.log('[HideTextEdit] SyncType: self, Updating block:', targetUid, 'with text:', data.text);
        await logseq.Editor.updateBlock(targetUid, data.text);
        res = true;
        break;
      case "children":
        console.log('[HideTextEdit] SyncType: children, Appending block to:', currentUid, 'with text:', data.text);
        const childrenRes = await logseq.Editor.appendBlockInPage(
          currentUid,
          data.text
        );
        // Save the real Logseq UUID to the node so future siblings/children can reference it
        if (childrenRes?.uuid) {
            uidMap.value[data.uid] = childrenRes.uuid;
            // Use direct assignment to avoid re-render/focus loss caused by setData()
            node.nodeData.data.logseqUid = childrenRes.uuid;
            console.log('[HideTextEdit] Children created. MindMap UID:', data.uid, '-> Logseq UUID:', childrenRes.uuid);
        }
        res = childrenRes;
        break;
      case "sibling":
        console.log('[HideTextEdit] SyncType: sibling, Inserting block sibling to:', currentUid, 'with text:', data.text);
        const siblingRes = await logseq.Editor.insertBlock(
          currentUid,
          data.text,
          {
            sibling: true,
          }
        );
        if (siblingRes?.uuid) {
             uidMap.value[data.uid] = siblingRes.uuid;
             // Use direct assignment to avoid re-render/focus loss caused by setData()
             node.nodeData.data.logseqUid = siblingRes.uuid;
             console.log('[HideTextEdit] Sibling created. MindMap UID:', data.uid, '-> Logseq UUID:', siblingRes.uuid);
        }
        res = siblingRes;
        break;
    }
  } catch (error) {
    res = false;
    showToast((error as Error).message, "error");
    console.error('[HideTextEdit] Error:', error);
  } finally {
    setSyncNodeType("self"); // Ensure global state is reset
    // CRITICAL: Restore focus to the plugin window/container after async operations
    // Logseq API calls might steal focus to the main app, so we wait a bit and force it back
    setTimeout(() => {
        window.focus();
        const container = document.getElementById("mindMapContainer");
        if (container) container.focus();
    }, 100);
  }

  if (res) {
    showToast(`Update ${syncType} Success!`, "success");
  }
  
  setSyncNodeType("self");
};

const handleSave = async (value: string, language: string) => {
  try {
    await logseq.Editor.updateBlock(
      activeNode.value?.getData()?.uid,
      `
\`\`\`${language}
${value}
\`\`\`
      `
    );

    const tree = page.value?.uuid
      ? await logseq.Editor.getPageBlocksTree(page.value.uuid)
      : [];

    setTrees(tree);

    codeEditor.value.isOpen = false;
    showToast("Update Success!", "success");
  } catch (error) {
    showToast((error as Error).message, "error");
  }
};

const handleNodeContextmenu = (e, node) => {
  setRightClickType("node");
  setMenuLeft(e.clientX + 10);
  setMenuTop(e.clientY + 10);
  setIsShowMenu(true);
  setActiveNode(node);
};

const handleSvgMouseDown = (e) => {
  if (e.which !== 3) return;
  mouseDownX.value = e.clientX;
  mouseDownY.value = e.clientY;
  isMouseDown.value = true;
};

const handleNodeDoubleClick = (node) => {
  console.log('双击节点事件触发', node);
  
  // 关闭右键菜单
  handleCloseMenu();
  
  try {
    // 直接使用 simple-mind-map 的内置编辑功能
    // 通过模拟 F2 按键或直接调用编辑方法
    if (mindMap.value && node) {
      // 首先激活节点
      node.active();
      
      // 然后启动编辑
      if (mindMap.value.renderer && mindMap.value.renderer.textEdit) {
        console.log('调用 textEdit.show 方法');
        mindMap.value.renderer.textEdit.show({
          node: node
        });
      } else {
        console.log('尝试使用 execCommand 启动编辑');
        // 如果 textEdit.show 不可用，尝试使用命令
        mindMap.value.execCommand('START_TEXT_EDIT');
      }
    }
  } catch (error) {
    console.error('启动文本编辑时出错:', error);
  }
};

const handleMouseUp = (e) => {
  if (!isMouseDown.value) return (isMouseDown.value = false);

  if (
    Math.abs(mouseDownX.value - e.clientX) > 3 ||
    Math.abs(mouseDownY.value - e.clientY) > 3
  )
    return handleCloseMenu();

  setRightClickType("canvas");
  setIsShowMenu(true);
  setMenuLeft(e.clientX + 10);
  setMenuTop(e.clientY + 10);
};
</script>

<template>
  <div id="main" :data-theme="isDarkUI ? 'dark' : 'light'" ref="mainRef">
    <span
      v-show="isLoading"
      class="loading loading-spinner loading-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px]"
    ></span>
    <div id="mindMapContainer" tabindex="0"></div>
    <SettingMenu v-show="!isZenMode" />
    <ToolBar v-show="!isZenMode" />
    <ToolDrawer v-show="!isZenMode" />
    <CodeEditor
      :is-open="codeEditor.isOpen"
      :value="codeEditor.content"
      :language="codeEditor.language"
      :is-dark-u-i="isDarkUI"
      @close="codeEditor = { isOpen: false, language: '', content: '' }"
      @save="handleSave"
    />
    <Guide />
    <RightMenu />
  </div>
</template>

<style>
@import "./css/simpleMindMap.esm.css";

#main {
  width: 100vw;
  height: 100vh;
}

.close-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
}

#mindMapContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
