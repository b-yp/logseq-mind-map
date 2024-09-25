import "@logseq/libs";
import proxyLogseq from "logseq-proxy";
import { createApp } from "vue";

import App from './App.vue'

const app = createApp(App)

let isMounted = false;

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
  if (isMounted) return;
  app.mount("#root");
  isMounted = true;
}
