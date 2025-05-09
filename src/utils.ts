import "@logseq/libs";
import { AppGraphInfo, BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import hljs from "highlight.js";

import { useCommonStore } from "@/stores";

export const getData = (
  trees: Array<BlockEntity>,
  currentGraph: AppGraphInfo
): IMindMap.Data[] => {
  const data: IMindMap.Data[] = [];
  trees
    .filter((tree) => !!tree.content.trim())
    .forEach((tree) => {
      data.push({
        data: getContent(tree, currentGraph),
        children: !!tree.children?.length
          ? getData(tree.children as BlockEntity[], currentGraph)
          : [],
      });
    });
  return data.filter((item) => item.data.text);
};

const getContent = (
  block: BlockEntity,
  currentGraph: AppGraphInfo
): Partial<IMindMap.PureData> => {
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
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = imageRegex.exec(data.text!)) !== null) {
    const alt = match[1];
    const relativeUrl = match[2];
    const absoluteUrl = currentGraph?.path + relativeUrl.slice(2);

    data.richText = true;
    data.image = absoluteUrl;
    data.imageTitle = alt;
    data.imageSize = {
      width: 100,
      height: 100,
      custom: false,
    };
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
