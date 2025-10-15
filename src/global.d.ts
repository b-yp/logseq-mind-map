// Global type declarations

declare module 'dompurify' {
  const DOMPurify: {
    sanitize(dirty: string | Node, config?: any): string;
    addHook(entryPoint: string, hookFunction: Function): void;
    removeHook(entryPoint: string): void;
    removeHooks(entryPoint: string): void;
    removeAllHooks(): void;
    isValidAttribute(tag: string, attr: string, value: string): boolean;
    setConfig(config?: any): void;
    clearConfig(): void;
    isSupported: boolean;
    version: string;
  };
  export = DOMPurify;
  export default DOMPurify;
}