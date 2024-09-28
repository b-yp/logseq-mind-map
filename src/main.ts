import "@logseq/libs";
import proxyLogseq from "logseq-proxy";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from './App.vue'
import useMindStore from "./stores/mind";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

let isMounted = false;

const mindStore = useMindStore();
const { setPage, setTrees, setCurrentGraph } = mindStore

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
  const tree = page?.uuid ? await logseq.Editor.getPageBlocksTree(page.uuid) : [];
  setPage(page);
  setTrees(tree);
}

async function setData() {
  const page = await logseq.Editor.getCurrentPage();
  const tree = page?.uuid ? await logseq.Editor.getPageBlocksTree(page.uuid) : [];
  const currentGraph = await logseq.App.getCurrentGraph();
  setPage(page);
  setTrees(tree);
  setCurrentGraph(currentGraph);
}
