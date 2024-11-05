import { CONSTANTS } from "@/config/constant";

export default {
  webGuide: {
    title: "Request error, please open Logseq API Server!",
    setting: {
      1: "Open Logseq settings, click “Features”, and open “HTTP APIs Server”",
      2: "Click the API icon, click “Authorization tokens”, add a token, the name can be anything, the value is “mind-map”",
      3: "Click “Server configurations”, set Host and Port, after setting click “Reset”",
      4: "Click “Start server”",
    },
  },
  menu: {
    language: "Language",
    theme: "Theme",
    refresh: "Refresh",
    refreshDescription: "Get the latest Logseq page data",
  },
  rightMenu: {
    /** node */
    insertSiblingNode: "Insert Sibling Node",
    insertChildNode: "Insert Child Node",
    collapseAllSiblingNode: "Collapse All Sibling Nodes",
    collapseOtherSiblingNode: "Collapse Other Sibling Nodes",
    collapseOtherParentNode: "Collapse Other Parent Nodes",
    deleteNode: "Delete Node",
    deleteCurrentNode: "Delete Current Node",
    /** canvas */
    backRootNode: "Back to Root Node",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    expandTo: "Expand To",
    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",
    level4: "Level 4",
    level5: "Level 5",
    level6: "Level 6",
    fitCanvas: "Fit Canvas",
    zenMode: "Zen Mode",
  },
  toolBar: {
    style: "Style",
    theme: "Theme",
    structure: "Structure",
    outline: "Outline",
    search: "Search",
    export: "Export",
  },
  style: {
    background: "Background",
    color: "Color",
    image: "Image",
    line: "Line",
    width: "Width",
    style: "Style",
    straight: "Straight",
    curve: "Curve",
    direct: "Direct",
    showArrow: "Show Arrow",
  },
  theme: {
    classics: "Classics",
    dark: "Darkness",
    simple: "Simple",
  },
  structure: {
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE]: "Logic Structure",
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT]: "Left Logic Structure",
    [CONSTANTS.LAYOUT.MIND_MAP]: "Mind Map",
    [CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE]: "Organization Structure",
    [CONSTANTS.LAYOUT.CATALOG_ORGANIZATION]: "Catalog Organization",
    [CONSTANTS.LAYOUT.TIMELINE]: "Timeline",
    [CONSTANTS.LAYOUT.TIMELINE2]: "Timeline2",
    [CONSTANTS.LAYOUT.VERTICAL_TIMELINE]: "Vertical Timeline",
    [CONSTANTS.LAYOUT.FISHBONE]: "Fishbone",
  },
  search: {
    placeholder: "Please enter the search content",
    current: "Current",
    total: "Total",
    next: "Next",
    empty: "No results found",
  },
  export: {
    image: {
      title: "Image",
      description: "Suitable for viewing and sharing",
    },
    svg: {
      title: "SVG",
      description: "Scalable Vector Graphics",
    },
    pdf: {
      title: "PDF",
      description: "Suitable for printing",
    },
  },
  imageUploader: {
    upload: "Click to upload image",
  },
};
