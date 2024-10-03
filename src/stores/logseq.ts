import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppGraphInfo, BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user";

interface LogseqStore {
    page: PageEntity | BlockEntity | null;
    trees: Array<BlockEntity>;
    currentGraph: AppGraphInfo | null;
}

const useLogseqStore = defineStore("logseq", () => {
    const page = ref<LogseqStore["page"]>(null);
    const trees = ref<LogseqStore["trees"]>([]);
    const currentGraph = ref<LogseqStore["currentGraph"]>(null);

    const getPage = () => page.value;
    const getTrees = () => trees.value;
    const getCurrentGraph = () => currentGraph.value;

    const setPage = (p: LogseqStore["page"]) => page.value = p;
    const setTrees = (t: LogseqStore["trees"]) => trees.value = t;
    const setCurrentGraph = (g: LogseqStore["currentGraph"]) => currentGraph.value = g;

    return {
        page,
        trees,
        currentGraph,
        getPage,
        getTrees,
        getCurrentGraph,
        setPage,
        setTrees,
        setCurrentGraph,
    };
});

export default useLogseqStore;
