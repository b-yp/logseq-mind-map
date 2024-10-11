import { CONSTANTS } from "@/config/constant";

export default {
  webGuide: {
    title: 'Request error, please open Logseq API Server!',
    setting: {
      1: 'Open Logseq settings, click “Features”, and open “HTTP APIs Server”',
      2: 'Click the API icon, click “Authorization tokens”, add a token, the name can be anything, the value is “mind-map”',
      3: 'Click “Server configurations”, set Host and Port, after setting click “Reset”',
      4: 'Click “Start server”',
    }
  },
  menu: {
    language: 'Language',
    theme: 'Theme',
  },
  toolBar: {
    theme: 'Theme',
    structure: 'Structure',
    outline: 'Outline',
    search: 'Search',
    export: 'Export',
  },
  theme: {
    classics: 'Classics',
    dark: 'Darkness',
    simple: 'Simple',
  },
  structure: {
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE]: 'Logic Structure',
    [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT]: 'Left Logic Structure',
    [CONSTANTS.LAYOUT.MIND_MAP]: 'Mind Map',
    [CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE]: 'Organization Structure',
    [CONSTANTS.LAYOUT.CATALOG_ORGANIZATION]: 'Catalog Organization',
    [CONSTANTS.LAYOUT.TIMELINE]: 'Timeline',
    [CONSTANTS.LAYOUT.TIMELINE2]: 'Timeline2',
    [CONSTANTS.LAYOUT.VERTICAL_TIMELINE]: 'Vertical Timeline',
    [CONSTANTS.LAYOUT.FISHBONE]: 'Fishbone',
  },
  search: {
    placeholder: 'Please enter the search content',
    current: 'Current',
    total: 'Total',
    next: 'Next',
    empty: 'No results found',
  },
  export: {
    image: {
      title: 'Image',
      description: 'Suitable for viewing and sharing',
    },
    svg: {
      title: 'SVG',
      description: 'Scalable Vector Graphics',
    },
    pdf: {
      title: 'PDF',
      description: 'Suitable for printing',
    },
  }
}
