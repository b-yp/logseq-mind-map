import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export const getData = (trees: Array<BlockEntity>): MindMap.Data[] => {
  const data: MindMap.Data[] = [];
  trees.filter((tree) => !!tree.content.trim()).forEach((tree) => {
    data.push({
      data: {
        text: tree.content,
      },
      children: !!tree.children?.length ? getData(tree.children as BlockEntity[]) : [],
    });
  });
  return data;
};
