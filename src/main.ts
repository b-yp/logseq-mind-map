import "@logseq/libs";
import proxyLogseq from "logseq-proxy";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { InstallCodeMirror } from "codemirror-editor-vue3";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

import App from "@/App.vue";
import { useLogseqStore, useCommonStore } from "@/stores";
import messages from "@/lang/index";
import "@/css/tailwind.css";
import "@/assets/iconfont.js";
import { showToast } from "./utils";

const locale = localStorage.getItem("localeValue");
const i18n = createI18n({
  legacy: false,
  locale: locale || "English",
  fallbackLocale: "简体中文",
  messages,
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(i18n);
app.use(InstallCodeMirror);

let isMounted = false;

const logseqStore = useLogseqStore();
const commonStore = useCommonStore();
const { setPage, setTrees, setCurrentGraph } = logseqStore;
const { setIsFetchFailed } = commonStore;

// @ts-ignore
self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    switch (label) {
      case "json":
        return new jsonWorker();
      case "css":
      case "scss":
      case "less":
        return new cssWorker();
      case "html":
      case "handlebars":
      case "razor":
        return new htmlWorker();
      case "typescript":
      case "javascript":
      case "ts":
      case "js":
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
};

if (import.meta.env.VITE_MODE === "web") {
  // run in browser
  console.log(
    "[faiz:] === meta.env.VITE_LOGSEQ_API_SERVER",
    import.meta.env.VITE_LOGSEQ_API_SERVER
  );
  console.log(
    `%c[version]: v${__APP_VERSION__}`,
    "background-color: #60A5FA; color: white; padding: 4px;"
  );
  proxyLogseq({
    config: {
      apiServer: import.meta.env.VITE_LOGSEQ_API_SERVER,
      apiToken: import.meta.env.VITE_LOGSEQ_API_TOKEN,
    },
    settings: window.mockSettings,
  });
  renderApp();
} else {
  console.log("=== logseq-mind-map loaded ===");
  logseq.ready(() => {
    logseq.provideModel({
      show() {
        renderApp();
        logseq.showMainUI();
      },
    });

    logseq.App.registerUIItem('pagebar', {
      key: 'logseq-mark-map',
      template: `
        <a class="button" data-on-click="show" title="Open mindmap mode">
          <svg t="1728493069636" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8028" width="20" height="20">
            <path d="M840.533333 490.666667l-17.066666-85.333334L554.666667 460.8V170.666667h-85.333334v262.4l-296.533333-192-46.933333 72.533333 324.266666 209.066667L200.533333 849.066667l68.266667 51.2 241.066667-315.733334 179.2 270.933334 72.533333-46.933334-179.2-266.666666z" fill="#CFD8DC" p-id="8029"></path>
            <path d="M512 512m-149.333333 0a149.333333 149.333333 0 1 0 298.666666 0 149.333333 149.333333 0 1 0-298.666666 0Z" fill="#3F51B5" p-id="8030"></path>
            <path d="M512 170.666667m-106.666667 0a106.666667 106.666667 0 1 0 213.333334 0 106.666667 106.666667 0 1 0-213.333334 0Z" fill="#00BCD4" p-id="8031"></path>
            <path d="M832 448m-106.666667 0a106.666667 106.666667 0 1 0 213.333334 0 106.666667 106.666667 0 1 0-213.333334 0Z" fill="#00BCD4" p-id="8032"></path>
            <path d="M149.333333 277.333333m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="#00BCD4" p-id="8033"></path>
            <path d="M234.666667 874.666667m-106.666667 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="#00BCD4" p-id="8034"></path>
            <path d="M725.333333 832m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="#00BCD4" p-id="8035"></path>
          </svg>
        </a>
      `,
    })
  });
}

function renderApp() {
  setData();
  if (isMounted) return;
  app.mount("#root");
  isMounted = true;
}

async function setData() {
  try {
    const page = await logseq.Editor.getCurrentPage();
    const tree = page?.uuid
      ? await logseq.Editor.getPageBlocksTree(page.uuid)
      : [];
    const currentGraph = await logseq.App.getCurrentGraph();
    setPage(page);
    setTrees(tree);
    setCurrentGraph(currentGraph);
    setIsFetchFailed(false);
  } catch (error: any) {
    console.error("error ❌", error?.message);
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      setIsFetchFailed(true);
      showToast(`${error.name}: ${error.message}`, "error");
    }
  }
}
