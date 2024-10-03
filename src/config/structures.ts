import { CONSTANTS } from "./constant";

export const layoutList = [
  CONSTANTS.LAYOUT.LOGICAL_STRUCTURE,
  CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT,
  CONSTANTS.LAYOUT.MIND_MAP,
  CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE,
  CONSTANTS.LAYOUT.CATALOG_ORGANIZATION,
  CONSTANTS.LAYOUT.TIMELINE,
  CONSTANTS.LAYOUT.TIMELINE2,
  CONSTANTS.LAYOUT.VERTICAL_TIMELINE,
  CONSTANTS.LAYOUT.FISHBONE,
]

export const structureImageMap = {
  [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE]: await import('@/assets/images/structures/logicalStructure.png'),
  [CONSTANTS.LAYOUT.LOGICAL_STRUCTURE_LEFT]: await import('@/assets/images/structures/logicalStructureLeft.jpg'),
  [CONSTANTS.LAYOUT.MIND_MAP]: await import('@/assets/images/structures/mindMap.png'),
  [CONSTANTS.LAYOUT.ORGANIZATION_STRUCTURE]: await import('@/assets/images/structures/organizationStructure.png'),
  [CONSTANTS.LAYOUT.CATALOG_ORGANIZATION]: await import('@/assets/images/structures/catalogOrganization.png'),
  [CONSTANTS.LAYOUT.TIMELINE]: await import('@/assets/images/structures/timeline.png'),
  [CONSTANTS.LAYOUT.TIMELINE2]: await import('@/assets/images/structures/timeline2.png'),
  [CONSTANTS.LAYOUT.VERTICAL_TIMELINE]: await import('@/assets/images/structures/verticalTimeline.png'),
  [CONSTANTS.LAYOUT.FISHBONE]: await import('@/assets/images/structures/fishbone.png'),
}
