import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export const getData = (trees: Array<BlockEntity>): MindMap.Data[] => {
  const data: MindMap.Data[] = [];
  trees.filter((tree) => !!tree.content.trim()).forEach((tree) => {
    data.push({
      data: {
        text: getContent(tree),
      },
      children: !!tree.children?.length ? getData(tree.children as BlockEntity[]) : [],
    });
  });
  return data;
};

const getContent = (block: BlockEntity) => {
  let content = block.content.trim();
  if (block.propertiesTextValues) {
    const propertiesKeys = Object.keys(block.propertiesTextValues);
    const contentArray = content.split("\n");
    const pureContentArray = contentArray.filter((item) => {
      return !propertiesKeys.some((key) => item.trim().startsWith(`${key}::`))
    })
    content = pureContentArray.join("\n");
  }
  return content;
};
