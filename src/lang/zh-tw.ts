import { CONSTANTS } from "@/config/constant";

export default {
  toolBar: {
    theme: '主題',
    structure: '結構',
  },
  theme: {
    title: '主題',
    classics: '經典',
    dark: '深色',
    simple: '簡約',
  },
  structure: {
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE]: '邏輯結構圖',
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT]: '向左邏輯結構圖',
    [CONSTANTS.LAYOUT.MIND_MAP]: '思維導圖',
    [CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE]: '組織結構圖',
    [CONSTANTS.LAYOUT.CATALOG_ORGANIZATION]: '目錄組織圖',
    [CONSTANTS.LAYOUT.TIMELINE]: '時間軸',
    [CONSTANTS.LAYOUT.TIMELINE2]: '時間軸2',
    [CONSTANTS.LAYOUT.VERTICAL_TIMELINE]: '豎向時間軸',
    [CONSTANTS.LAYOUT.FISHBONE]: '魚骨圖',
  }
}
