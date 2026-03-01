import "@logseq/libs";
import { AppGraphInfo, BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import hljs from "highlight.js";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { useCommonStore } from "@/stores";

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true, // 支持 GitHub Flavored Markdown
});

// 预编译的正则表达式常量
const CODE_BLOCK_PATTERN = /```[\s\S]*```/;
const MARKDOWN_PATTERNS = [
  /^#{1,6}\s/, // 标题
  /\*\*.*\*\*/, // 粗体
  /\*.*\*/, // 斜体
  /__.*__/, // 粗体
  /_.*_/, // 斜体
  /~~.*~~/, // 删除线
  /`.*`/, // 行内代码
  /^\s*[-*+]\s/m, // 无序列表
  /^\s*\d+\.\s/m, // 有序列表
  /\[.*\]\(.*\)/, // 链接
  /!\[.*\]\(.*\)/, // 图片
  /^\s*>\s/m, // 引用
  /^\s*\|.*\|/m, // 表格
  /---+/, // 分割线
  // Logseq 特殊语法
  /\b(LATER|NOW|TODO|DOING|DONE|WAITING|CANCELLED)\b/, // 任务状态
  /:LOGBOOK:/, // Logbook 开始
  /:END:/, // Logbook 结束
  /CLOCK:\s*\[.*\]/, // 时间戳
  /#\w+/, // 标签
  /\[\[.*\]\]/, // 页面引用
];

// 任务状态颜色映射
const TASK_STATE_COLORS = {
  'LATER': '#ff9500',    // 橙色
  'NOW': '#007acc',      // 蓝色
  'TODO': '#666666',     // 灰色
  'DOING': '#0066cc',    // 蓝色
  'DONE': '#28a745',     // 绿色
  'WAITING': '#ffc107',  // 黄色
  'CANCELLED': '#dc3545' // 红色
} as const;

// DOMPurify 配置
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 's', 'del', 'strike',
    'code', 'pre', 'blockquote',
    'ul', 'ol', 'li',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'span', 'div'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style']
};

/**
 * 检查文本是否包含 Markdown 语法
 */
const isMarkdown = (text: string): boolean => {
  // 如果包含代码块，不进行 Markdown 渲染，让原有的代码高亮处理
  if (CODE_BLOCK_PATTERN.test(text)) {
    return false;
  }

  return MARKDOWN_PATTERNS.some(pattern => pattern.test(text));
};

/**
 * 处理 Logseq 特殊语法
 */
const processLogseqSyntax = (container: HTMLElement): void => {
  // 处理任务状态
  Object.keys(TASK_STATE_COLORS).forEach(state => {
    const regex = new RegExp(`\\b${state}\\b`, 'g');
    processTextNodes(container, (text) => {
      return text.replace(regex, (match) => {
        const color = TASK_STATE_COLORS[state as keyof typeof TASK_STATE_COLORS];
        return `<span style="
          background-color: ${color};
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.8em;
          font-weight: bold;
          margin-right: 4px;
        ">${match}</span>`;
      });
    });
  });

  // 处理时间戳
  processTextNodes(container, (text) => {
    // CLOCK: [timestamp] 格式
    text = text.replace(/CLOCK:\s*\[(.*?)\]/g, (match, timestamp) => {
      return `<span style="
        color: #666;
        font-family: monospace;
        font-size: 0.9em;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 2px 4px;
        border-radius: 2px;
      ">⏰ ${timestamp}</span>`;
    });

    // :LOGBOOK: 和 :END:
    text = text.replace(/:LOGBOOK:/g, '<span style="color: #666; font-weight: bold;">📋 LOGBOOK:</span>');
    text = text.replace(/:END:/g, '<span style="color: #666; font-weight: bold;">📋 END:</span>');

    return text;
  });

  // 处理标签
  processTextNodes(container, (text) => {
    return text.replace(/#(\w+)/g, (match, tag) => {
      return `<span style="
        color: #0066cc;
        background-color: rgba(0, 102, 204, 0.1);
        padding: 1px 4px;
        border-radius: 2px;
        font-size: 0.9em;
      ">#${tag}</span>`;
    });
  });

  // 处理页面引用
  processTextNodes(container, (text) => {
    return text.replace(/\[\[(.*?)\]\]/g, (match, page) => {
      return `<span style="
        color: #0066cc;
        background-color: rgba(0, 102, 204, 0.05);
        padding: 1px 3px;
        border: 1px solid rgba(0, 102, 204, 0.2);
        border-radius: 2px;
        font-size: 0.9em;
      ">📄 ${page}</span>`;
    });
  });
};

/**
 * 处理文本节点中的内容
 */
const processTextNodes = (element: HTMLElement, processor: (text: string) => string): void => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Text[] = [];
  let node: Node | null;
  while (node = walker.nextNode()) {
    textNodes.push(node as Text);
  }

  textNodes.forEach(textNode => {
    const processedText = processor(textNode.textContent || '');
    if (processedText !== textNode.textContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedText;

      // 替换文本节点
      const parent = textNode.parentNode;
      if (parent) {
        while (tempDiv.firstChild) {
          parent.insertBefore(tempDiv.firstChild, textNode);
        }
        parent.removeChild(textNode);
      }
    }
  });
};



/**
 * 高效应用 Markdown 样式 - 一次遍历处理所有元素
 */
const applyMarkdownStyles = (container: HTMLElement): void => {
  // 基础容器样式
  container.style.cssText = `
    font-size: 14px;
    line-height: 1.5;
    color: inherit;
    max-width: 300px;
    word-wrap: break-word;
    padding: 8px 12px;
    box-sizing: border-box;
  `;

  // 一次遍历处理所有子元素
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  let node: Element | null;
  const tableRows: HTMLElement[] = [];

  while (node = walker.nextNode() as Element) {
    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        const level = parseInt(tagName.charAt(1));
        const fontSize = getHeadingFontSize(level);
        element.style.cssText = `
          margin: 8px 0 4px 0;
          font-weight: bold;
          font-size: ${fontSize}em;
          color: inherit;
        `;
        break;
      case 'p':
        element.style.cssText = 'margin: 4px 0; color: inherit;';
        break;
      case 'code':
        element.style.cssText = 'background-color: rgba(0, 0, 0, 0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em;';
        break;
      case 'pre':
        element.style.cssText = 'background-color: rgba(0, 0, 0, 0.1); padding: 8px; border-radius: 4px; overflow-x: auto; margin: 8px 0;';
        break;
      case 'blockquote':
        element.style.cssText = 'border-left: 4px solid currentColor; padding-left: 12px; margin: 8px 0; color: inherit; opacity: 0.7;';
        break;
      case 'ul':
      case 'ol':
        element.style.cssText = 'margin: 4px 0; padding-left: 20px;';
        break;
      case 'a':
        element.style.cssText = 'color: #0066cc; text-decoration: underline;';
        break;
      case 'del':
      case 's':
      case 'strike':
        element.style.cssText = 'text-decoration: line-through; color: inherit;';
        break;
      case 'img':
        element.style.cssText = 'max-width: 100%; height: auto; border-radius: 4px; margin: 4px 0;';
        break;
      case 'table':
        element.style.cssText = 'border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 0.9em; border: 1px solid #ddd;';
        break;
      case 'th':
        element.style.cssText = 'background-color: rgba(0, 0, 0, 0.1); border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-weight: bold;';
        break;
      case 'td':
        element.style.cssText = 'border: 1px solid #ddd; padding: 8px 12px; text-align: left;';
        break;
      case 'tr':
        tableRows.push(element);
        break;
    }
  }

  // 处理表格行的斑马纹
  tableRows.forEach((tr, index) => {
    if (index % 2 === 0) {
      tr.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
    }
  });
};

/**
 * 计算标题字体大小
 */
const getHeadingFontSize = (level: number): number => {
  return Math.max(1.0, 2.0 - level * 0.2); // h1=1.8em, h2=1.6em, ..., h6=1.0em
};

/**
 * 将 Markdown 文本渲染为 HTML
 */
const renderMarkdown = (text: string): string => {
  try {
    // 使用 marked 解析 Markdown
    const html = marked(text);

    // 使用 DOMPurify 清理 HTML，防止 XSS 攻击
    return DOMPurify.sanitize(html as string, DOMPURIFY_CONFIG);
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return `<p style="color: #ff6b6b; font-style: italic;">Markdown 渲染失败: ${error instanceof Error ? error.message : '未知错误'}</p>`;
  }
};

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
  // Use Promise.all to map nodes in parallel but preserve order
  const data = await Promise.all(trees
    .map(async (tree) => {
      return {
        data: await getContent(tree, currentGraph),
        children: !!tree.children?.length
          ? await getData(tree.children as BlockEntity[], currentGraph)
          : [],
      };
    }));

  return data;
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
  let match: RegExpExecArray | null;
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
    let finalWidth: number, finalHeight: number;

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

  // 检查是否需要 Markdown 渲染（但不包含图片的情况）
  if (data.text && isMarkdown(data.text) && !data.image) {
    // 如果包含 Markdown 语法且不是图片节点，启用富文本并渲染
    data.richText = true;
    // 创建一个包含渲染后 HTML 的容器
    const htmlContent = renderMarkdown(data.text);

    // 创建一个临时的 DOM 元素来包含渲染后的内容
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.className = 'markdown-content';

    // 添加样式类而不是内联样式
    applyMarkdownStyles(container);

    // 处理 Logseq 特殊语法
    processLogseqSyntax(container);

    // 将渲染后的 DOM 元素存储到 data 中
    data.customNodeContent = container;
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
  let originLanguage: string = '';
  let code: string = '';
  let match: RegExpExecArray | null;

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
// 导出内部函数供其他模块使用
export { isMarkdown, renderMarkdown, applyMarkdownStyles, processLogseqSyntax };