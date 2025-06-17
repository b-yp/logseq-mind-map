import "@logseq/libs";
import { AppGraphInfo, BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import hljs from "highlight.js";

import { useCommonStore } from "@/stores";

// 添加一个辅助函数来获取图片尺寸
const getImageDimensions = (url: string): Promise<{ width: number, height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      // 加载失败时使用默认尺寸
      resolve({
        width: 100,
        height: 100
      });
    };
    img.src = url;
  });
};

export const getData = async (
  trees: Array<BlockEntity>,
  currentGraph: AppGraphInfo
): Promise<IMindMap.Data[]> => {
  const data: IMindMap.Data[] = [];

  // 使用 Promise.all 处理所有节点
  await Promise.all(trees
    .filter((tree) => !!tree.content.trim())
    .map(async (tree) => {
      data.push({
        data: await getContent(tree, currentGraph),
        children: !!tree.children?.length
          ? await getData(tree.children as BlockEntity[], currentGraph)
          : [],
      });
    }));

  return data.filter((item) => item.data.text);
};

const getContent = async (
  block: BlockEntity,
  currentGraph: AppGraphInfo
): Promise<Partial<IMindMap.PureData>> => {
  const data: Partial<IMindMap.PureData> = {
    text: block.content.trim(),
    uid: block.uuid,
  };
  if (block.propertiesTextValues) {
    const propertiesKeys = Object.keys(block.propertiesTextValues);
    const contentArray = data.text!.split("\n");
    const pureContentArray = contentArray.filter((item) => {
      return !propertiesKeys.some((key) => {
        const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const trimmedItem = item.trim();
        return trimmedItem.startsWith(`${kebabKey}::`);
      });
    });
    data.text = pureContentArray.join("\n");
  }

  const imageRegex = /!\[(.*?)\]\((.*?)\)(\{:height (\d+), :width (\d+)\})?/g;
  let match;
  while ((match = imageRegex.exec(data.text!)) !== null) {
    const alt = match[1];
    const url = match[2];
    const hasSize = !!match[3];

    // 判断是否为在线图片URL
    const isOnlineImage = url.startsWith('http://') || url.startsWith('https://');
    const imageUrl = isOnlineImage ? url : currentGraph?.path + url.slice(2);

    // 获取图片实际尺寸
    let actualWidth = 100;
    let actualHeight = 100;
    let aspectRatio = 1; // 宽高比

    try {
      const dimensions = await getImageDimensions(imageUrl);
      actualWidth = dimensions.width;
      actualHeight = dimensions.height;
      aspectRatio = actualWidth / actualHeight;
    } catch (error) {
      console.error('Failed to get image dimensions:', error);
    }

    // 设置最终尺寸
    let finalWidth, finalHeight;

    if (hasSize) {
      // 如果有设置宽高，使用设置的宽度，并根据比例计算高度
      finalWidth = parseInt(match[5], 10);
      finalHeight = Math.round(finalWidth / aspectRatio);
    } else {
      // 如果没有设置宽高，使用实际尺寸
      finalWidth = actualWidth;
      finalHeight = actualHeight;
    }

    // 设置最大宽度限制
    const MAX_WIDTH = 800;

    // 在计算最终尺寸时添加限制
    if (!hasSize && finalWidth > MAX_WIDTH) {
      finalWidth = MAX_WIDTH;
      finalHeight = Math.round(MAX_WIDTH / aspectRatio);
    }

    data.richText = true;
    data.image = imageUrl;
    data.imageTitle = alt;
    data.imageSize = {
      width: finalWidth,
      height: finalHeight,
      custom: true,
    };
    // data.text = ' ';
  }

  return data;
};

export const showToast = (
  message: string,
  type: string,
  duration: number = 3000
) => {
  const isWeb = import.meta.env.VITE_MODE === "web";
  if (isWeb) {
    const commonStore = useCommonStore();

    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-end";
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    const span = document.createElement("span");
    span.textContent = message;
    alert.appendChild(span);
    toast.appendChild(alert);
    commonStore.mainRef?.appendChild(toast);

    setTimeout(() => {
      commonStore.mainRef?.removeChild(toast);
    }, duration);
  } else {
    logseq.UI.showMsg(message, type);
  }
};

export const highlightCode = (
  content: string,
  fn: ({ language, code }: { language: string; code: string }) => void
) => {
  const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
  let originLanguage;
  let code;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    originLanguage = match[1].trim();
    code = match[2].trim();
  }
  if (!code) return null;
  const language = hljs.getLanguage(originLanguage)?.name?.split(",")[0];
  const highlightedCode = hljs.highlight(code, {
    language: language || "plaintext",
  }).value;
  const preElement = document.createElement("pre");
  const codeElement = document.createElement("code");
  const spanElement = document.createElement("span");
  codeElement.innerHTML = highlightedCode;
  spanElement.textContent = originLanguage;
  preElement.appendChild(codeElement);
  preElement.appendChild(spanElement);
  preElement.style.padding = "4px 8px";
  preElement.style.paddingTop = "1.5rem";
  preElement.style.position = "relative";
  spanElement.style.position = "absolute";
  spanElement.style.right = "2px";
  spanElement.style.top = "2px";
  spanElement.style.borderRadius = "4px";
  spanElement.style.padding = "2px 4px";
  spanElement.style.fontSize = "12px";
  spanElement.style.border = "1px solid #00d7c0";
  spanElement.style.display = originLanguage ? "block" : "none";
  preElement.ondblclick = () =>
    fn({ language: language || originLanguage, code });
  return preElement;
};

export const getNodesAtLevel = (tree: IMindMap.Data[], level: number): IMindMap.Data['data'][] => {
  const result: IMindMap.Data['data'][] = [];

  function traverse(node: IMindMap.Data[], currentLevel: number) {
    if (currentLevel === level) {
      result.push(...node.map((item) => item.data));
      return;
    }

    if (currentLevel < level) {
      for (const child of node) {
        traverse(child.children, currentLevel + 1);
      }
    }
  }

  traverse(tree, 1);
  return result;
};
