declare namespace MindMap {
  interface PureData {
    text: string; // 节点的文本，可以是富文本，也就是html格式的，此时richText要设为true
    richText: boolean; // 节点的文本是否是富文本模式
    expand: boolean; // 节点是否展开
    uid: string; // 节点唯一的id，可不传，内部会生成
    icon: []; // 图标，格式可参考教程里的【插入和扩展节点图标】章节
    image: string; // 图片的url
    imageTitle: string; // 图片的标题，可为空
    imageSize: {
      // 图片的尺寸
      width: number; // 图片的宽度，必传
      height: number; // 图片的高度，必传
      custom: boolean; // 如果设为true，图片的显示大小不受主题控制，以imageSize.width和imageSize.height为准
    };
    hyperlink: string; // 超链接地址
    hyperlinkTitle: string; // 超链接的标题
    note: string; // 备注的内容
    attachmentUrl: string; // v0.9.10+，附件url
    attachmentName: string; // v0.9.10+，附件名称
    tag: []; // 标签列表，v0.10.3以前的版本只支持字符串数组，即['标签']，v0.10.3+版本支持对象数组，即[{text: '标签', style: {}}]，具体支持的标签样式可参考下方【标签的样式】
    generalization: [
      {
        // （0.9.0以下版本不支持数组，只能设置单个概要数据）节点的概要，如果没有概要generalization设为null即可
        text: string; // 概要的文本
        richText: boolean; // 节点的文本是否是富文本模式
        // ...其他普通节点的字段都支持，但是不支持children
      }
    ];
    associativeLineTargets: string[]; // 如果存在关联线，那么为目标节点的uid列表
    associativeLineText: string; // 关联线文本
    // ...其他样式字段，可以参考主题
  }

  interface Data {
    data: Partial<PureData>;
    children: Data[];
  }
}
