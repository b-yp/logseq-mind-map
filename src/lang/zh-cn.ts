import { CONSTANTS } from "@/config/constant";

export default {
  toolBar: {
    theme: '主题',
    structure: '结构',
    outline: '大纲',
  },
  theme: {
    title: '主题',
    classics: '经典',
    dark: '深色',
    simple: '朴素',
  },
  structure: {
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE]: '逻辑结构图',
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT]: '向左逻辑结构图',
    [CONSTANTS.LAYOUT.MIND_MAP]: '思维导图',
    [CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE]: '组织结构图',
    [CONSTANTS.LAYOUT.CATALOG_ORGANIZATION]: '目录组织图',
    [CONSTANTS.LAYOUT.TIMELINE]: '时间轴',
    [CONSTANTS.LAYOUT.TIMELINE2]: '时间轴2',
    [CONSTANTS.LAYOUT.VERTICAL_TIMELINE]: '竖向时间轴',
    [CONSTANTS.LAYOUT.FISHBONE]: '鱼骨图',
  }
}
