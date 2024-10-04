import { CONSTANTS } from "@/config/constant";

export default {
  toolBar: {
    theme: 'Theme',
    structure: 'Structure',
    outline: 'Outline',
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
  }
}
