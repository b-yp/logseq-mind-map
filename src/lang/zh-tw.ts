import { CONSTANTS } from "@/config/constant";

export default {
  menu: {
    language: '語言',
    theme: '主題',
  },
  toolBar: {
    theme: '主題',
    structure: '結構',
    outline: '大綱',
    search: '搜索',
    export: '匯出',
  },
  theme: {
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
  },
  search: {
    placeholder: '請輸入搜索內容',
    current: '當前',
    total: '總數',
    next: '下一個',
    empty: '沒有找到任何結果',
  },
  export: {
    image: {
      title: '圖片',
      description: '適合查看分享',
    },
    svg: {
      title: 'SVG',
      description: '可縮放矢量圖形',
    },
    pdf: {
      title: 'PDF',
      description: '適合打印',
    },
  }
}
