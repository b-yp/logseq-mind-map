declare module 'dompurify' {
  export interface Config {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
    ALLOW_ARIA_ATTR?: boolean;
    ALLOW_DATA_ATTR?: boolean;
    ALLOW_UNKNOWN_PROTOCOLS?: boolean;
    SAFE_FOR_TEMPLATES?: boolean;
    WHOLE_DOCUMENT?: boolean;
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
    RETURN_DOM_IMPORT?: boolean;
    RETURN_TRUSTED_TYPE?: boolean;
    FORCE_BODY?: boolean;
    SANITIZE_DOM?: boolean;
    KEEP_CONTENT?: boolean;
    IN_PLACE?: boolean;
    USE_PROFILES?: false | { mathMl?: boolean; svg?: boolean; svgFilters?: boolean; html?: boolean };
    FORBID_CONTENTS?: string[];
    CUSTOM_ELEMENT_HANDLING?: {
      tagNameCheck?: RegExp | ((tagName: string) => boolean);
      attributeNameCheck?: RegExp | ((lcName: string) => boolean);
      allowCustomizedBuiltInElements?: boolean;
    };
  }

  export interface SanitizeElementHookEvent {
    tagName: string;
    allowedTags: { [key: string]: boolean };
  }

  export interface SanitizeAttributeHookEvent {
    attrName: string;
    attrValue: string;
    keepAttr: boolean;
    allowedAttributes: { [key: string]: boolean };
  }

  export interface DOMPurifyI {
    sanitize(dirty: string, cfg?: Config): string;
    sanitize(dirty: string | Node, cfg: Config & { RETURN_DOM_FRAGMENT?: false; RETURN_DOM?: false }): string;
    sanitize(dirty: string | Node, cfg: Config & { RETURN_DOM_FRAGMENT: true }): DocumentFragment;
    sanitize(dirty: string | Node, cfg: Config & { RETURN_DOM: true }): HTMLElement;
    sanitize(dirty: string | Node, cfg?: Config): string | HTMLElement | DocumentFragment;
    
    addHook(entryPoint: 'beforeSanitizeElements', hookFunction: (currentNode: Element, data: SanitizeElementHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'uponSanitizeElement', hookFunction: (currentNode: Element, data: SanitizeElementHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'afterSanitizeElements', hookFunction: (currentNode: Element, data: SanitizeElementHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'beforeSanitizeAttributes', hookFunction: (currentNode: Element, data: SanitizeAttributeHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'uponSanitizeAttribute', hookFunction: (currentNode: Element, data: SanitizeAttributeHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'afterSanitizeAttributes', hookFunction: (currentNode: Element, data: SanitizeAttributeHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'beforeSanitizeShadowDOM', hookFunction: (fragment: DocumentFragment, data: SanitizeElementHookEvent) => void): void;
    addHook(entryPoint: 'uponSanitizeShadowNode', hookFunction: (currentNode: Element, data: SanitizeElementHookEvent, config: Config) => void): void;
    addHook(entryPoint: 'afterSanitizeShadowDOM', hookFunction: (fragment: DocumentFragment, data: SanitizeElementHookEvent) => void): void;
    
    removeHook(entryPoint: string): void;
    removeHooks(entryPoint: string): void;
    removeAllHooks(): void;
    isValidAttribute(tag: string, attr: string, value: string): boolean;
    setConfig(cfg?: Config): void;
    clearConfig(): void;
    isSupported: boolean;
    version: string;
  }

  const DOMPurify: DOMPurifyI;
  export default DOMPurify;
}