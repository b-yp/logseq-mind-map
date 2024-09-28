import { AppGraphInfo, BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export const getData = (trees: Array<BlockEntity>, currentGraph: AppGraphInfo): MindMap.Data[] => {
  const data: MindMap.Data[] = [];
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
  return data;
};

const getContent = (block: BlockEntity, currentGraph: AppGraphInfo): Partial<MindMap.PureData> => {
  const data: Partial<MindMap.PureData> = {
    text: block.content.trim(),
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
