import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { resolve } from "path";
import { existsSync } from "fs";
import path from "path";

import packageJSON from "./package.json";

const getMockSettings = (isWeb = false) => {
  const localSettingsPath = resolve(__dirname, "mocks/settings.local.json");
  if (isWeb && existsSync(localSettingsPath)) {
    return require(localSettingsPath);
  }
  return {};
};

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    plugins: [vue()],
    base: "./",
    build: {
      target: "esnext",
    },
    define: {
      mockSettings: getMockSettings(mode === "web"),
      __APP_VERSION__: JSON.stringify(packageJSON.version),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
