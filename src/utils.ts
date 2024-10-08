import { AppGraphInfo, BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export const getData = (trees: Array<BlockEntity>, currentGraph: AppGraphInfo): IMindMap.Data[] => {
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

const getContent = (block: BlockEntity, currentGraph: AppGraphInfo): Partial<IMindMap.PureData> => {
  const data: Partial<IMindMap.PureData> = {
    text: block.content.trim(),
    uid: block.uuid,
  }
  if (block.propertiesTextValues) {
    const propertiesKeys = Object.keys(block.propertiesTextValues);
    const contentArray = data.text!.split("\n");
    const pureContentArray = contentArray.filter((item) => {
      return !propertiesKeys.some((key) => item.trim().startsWith(`${key}::`));
    });
    data.text = pureContentArray.join("\n");
  }
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = imageRegex.exec(data.text!)) !== null) {
    const alt = match[1];
    const relativeUrl = match[2];
    const absoluteUrl = currentGraph?.path + relativeUrl.slice(2);

    data.richText = true
    data.image = absoluteUrl
    data.imageTitle = alt
    data.imageSize = {
      width: 100,
      height: 100,
      custom: false,
    }
  }
  return data;
};

export const showToast = (message: string, type: string) => {
  const isWeb = import.meta.env.VITE_MODE === "web";
  if (isWeb) {
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-end";
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    const span = document.createElement("span");
    span.textContent = message;
    alert.appendChild(span);
    toast.appendChild(alert);
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  } else {
    logseq.UI.showMsg(message, type);
  }
};
