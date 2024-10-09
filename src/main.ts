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
import { useLogseqStore } from "@/stores";
import messages from "@/lang/index";
import "@/css/tailwind.css";
import "@/assets/iconfont.js";

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
const { setPage, setTrees, setCurrentGraph } = logseqStore;

// @ts-ignore
self.MonacoEnvironment = {
	getWorker: function (workerId, label) {
		switch (label) {
			case 'json':
				return new jsonWorker();
			case 'css':
			case 'scss':
			case 'less':
				return new cssWorker();
			case 'html':
			case 'handlebars':
			case 'razor':
				return new htmlWorker();
			case 'typescript':
			case 'javascript':
      case 'ts':
      case 'js':
        return new tsWorker();
      default:
        return new editorWorker();
    }
	}
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

    logseq.App.registerUIItem("toolbar", {
      key: "logseq-mind-map",
      template:
        '<a data-on-click="show" class="button"><i class="ti ti-window"></i></a>',
    });
  });
}

function renderApp() {
  setData();
  if (isMounted) return;
  app.mount("#root");
  isMounted = true;
  renderMindMap();
}

async function renderMindMap() {
  const page = await logseq.Editor.getCurrentPage();
  const tree = page?.uuid
    ? await logseq.Editor.getPageBlocksTree(page.uuid)
    : [];
  setPage(page);
  setTrees(tree);
}

async function setData() {
  const page = await logseq.Editor.getCurrentPage();
  const tree = page?.uuid
    ? await logseq.Editor.getPageBlocksTree(page.uuid)
    : [];
  const currentGraph = await logseq.App.getCurrentGraph();
  setPage(page);
  setTrees(tree);
  setCurrentGraph(currentGraph);
}
