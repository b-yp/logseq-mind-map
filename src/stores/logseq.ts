import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppGraphInfo, BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user";

interface LogseqStore {
  page: PageEntity | BlockEntity | null;
  trees: Array<BlockEntity>;
  currentGraph: AppGraphInfo | null;
}

const useLogseqStore = defineStore(
  "logseq",
  () => {
    const page = ref<LogseqStore["page"]>(null);
    const trees = ref<LogseqStore["trees"]>([]);
    const currentGraph = ref<LogseqStore["currentGraph"]>(null);
    const logseqHost = ref<string>("");
    const logseqToken = ref<string>("");

    const setPage = (p: LogseqStore["page"]) => page.value = p;
    const setTrees = (t: LogseqStore["trees"]) => trees.value = t;
    const setCurrentGraph = (g: LogseqStore["currentGraph"]) => currentGraph.value = g;
    const setLogseqHost = (h: string) => logseqHost.value = h;
    const setLogseqToken = (t: string) => logseqToken.value = t;

    return {
      page,
      trees,
      currentGraph,
      logseqHost,
      logseqToken,
      setPage,
      setTrees,
      setCurrentGraph,
      setLogseqHost,
      setLogseqToken,
    };
  },
  {
    persist: {
      pick: ["logseqHost", "logseqToken"]
    }
  }
);

export default useLogseqStore;
