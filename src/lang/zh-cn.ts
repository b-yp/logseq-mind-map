import { CONSTANTS } from "@/config/constant";

export default {
  webGuide: {
    title: '请求错误，请打开 Logseq API Server!',
    setting: {
      1: '打开 Logseq 设置，点击 “更多功能”，打开 “HTTP APIs Server”',
      2: '点击 API 图标，点击 “Authorization tokens”，新增一个 token，名称随便写，值为 “mind-map”',
      3: '点击 “Server configurations”，设置 Host 和 Port，设置完点击 “Reset”',
      4: '点击 “Start server”',
    }
  },
  menu: {
    language: '语言',
    theme: '主题',
    refresh: '刷新',
    refreshDescription: '获取最新 Logseq 页面数据',
  },
  toolBar: {
    theme: '主题',
    structure: '结构',
    outline: '大纲',
    search: '搜索',
    export: '导出',
  },
  theme: {
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
  },
  search: {
    placeholder: '请输入搜索内容',
    current: '当前',
    total: '总数',
    next: '下一个',
    empty: '没有找到任何结果',
  },
  export: {
    image: {
      title: '图片',
      description: '适合查看分享',
    },
    svg: {
      title: 'SVG',
      description: '可缩放矢量图形',
    },
    pdf: {
      title: 'PDF',
      description: '适合打印',
    },
  }
}
