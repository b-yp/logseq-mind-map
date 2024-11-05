import { CONSTANTS } from "@/config/constant";

export default {
  webGuide: {
    title: "請開啟 Logseq API Server!",
    setting: {
      1: "開啟 Logseq 設定，點擊 “更多功能”，開啟 “HTTP APIs Server”",
      2: "點擊 API 圖示，點擊 “Authorization tokens”，新增一個 token，名稱隨便寫，值為 “mind-map”",
      3: "點擊 “Server configurations”，設定 Host 和 Port，設定完點擊 “Reset”",
      4: "點擊 “Start server”",
    },
  },
  menu: {
    language: "語言",
    theme: "主題",
    refresh: "刷新",
    refreshDescription: "獲取最新 Logseq 頁面數據",
  },
  rightMenu: {
    /** node */
    insertSiblingNode: "插入同級節點",
    insertChildNode: "插入子級節點",
    collapseAllSiblingNode: "折叠所有同级节点",
    collapseOtherSiblingNode: "折叠其他同级节点",
    collapseOtherParentNode: "折叠其他父级节点",
    deleteNode: "刪除節點",
    deleteCurrentNode: "僅刪除當前節點",
    /** canvas */
    backRootNode: "返回根節點",
    expandAll: "展開所有節點",
    collapseAll: "折叠所有节点",
    expandTo: "展開到",
    level1: "一級主題",
    level2: "二級主題",
    level3: "三級主題",
    level4: "四級主題",
    level5: "五級主題",
    level6: "六級主題",
    fitCanvas: "適應畫布",
    zenMode: "禪模式",
  },
  toolBar: {
    style: "樣式",
    theme: "主題",
    structure: "結構",
    outline: "大綱",
    search: "搜索",
    export: "匯出",
  },
  style: {
    background: "背景",
    color: "顏色",
    image: "圖片",
    line: "線條",
    width: "粗細",
    style: "風格",
    straight: "直線",
    curve: "曲線",
    direct: "直連",
    showArrow: "顯示箭頭",
  },
  theme: {
    classics: "經典",
    dark: "深色",
    simple: "簡約",
  },
  structure: {
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE]: "邏輯結構圖",
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT]: "向左邏輯結構圖",
    [CONSTANTS.LAYOUT.MIND_MAP]: "思維導圖",
    [CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE]: "組織結構圖",
    [CONSTANTS.LAYOUT.CATALOG_ORGANIZATION]: "目錄組織圖",
    [CONSTANTS.LAYOUT.TIMELINE]: "時間軸",
    [CONSTANTS.LAYOUT.TIMELINE2]: "時間軸2",
    [CONSTANTS.LAYOUT.VERTICAL_TIMELINE]: "豎向時間軸",
    [CONSTANTS.LAYOUT.FISHBONE]: "魚骨圖",
  },
  search: {
    placeholder: "請輸入搜索內容",
    current: "當前",
    total: "總數",
    next: "下一個",
    empty: "沒有找到任何結果",
  },
  export: {
    image: {
      title: "圖片",
      description: "適合查看分享",
    },
    svg: {
      title: "SVG",
      description: "可縮放矢量圖形",
    },
    pdf: {
      title: "PDF",
      description: "適合打印",
    },
  },
  imageUploader: {
    upload: "點擊上傳圖片",
  },
};
