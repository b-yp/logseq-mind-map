import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppGraphInfo, BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user";

interface MindStore {
    page: PageEntity | BlockEntity | null;
    trees: Array<BlockEntity>;
    currentGraph: AppGraphInfo | null;
}

const useMindStore = defineStore("mind", () => {
    const page = ref<MindStore["page"]>(null);
    const trees = ref<MindStore["trees"]>([]);
    const currentGraph = ref<MindStore["currentGraph"]>(null);

    const getPage = () => page.value;
    const getTrees = () => trees.value;
    const getCurrentGraph = () => currentGraph.value;

    const setPage = (p: MindStore["page"]) => page.value = p;
    const setTrees = (t: MindStore["trees"]) => trees.value = t;
    const setCurrentGraph = (g: MindStore["currentGraph"]) => currentGraph.value = g;

    return {
        page,
        getPage,
        getTrees,
        getCurrentGraph,
        setPage,
        setTrees,
        setCurrentGraph,
    };
});

export default useMindStore;
