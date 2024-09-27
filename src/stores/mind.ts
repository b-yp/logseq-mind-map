import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user";

interface MindStore {
    page: PageEntity | BlockEntity | null;
    trees: Array<BlockEntity>;
}

const useMindStore = defineStore("mind", () => {
    const page = ref<MindStore["page"]>(null);
    const trees = ref<MindStore["trees"]>([]);

    const getPage = () => {
        return page.value;
    };

    const getTrees = () => {
        return trees.value;
    };

    const setPage = (p: MindStore["page"]) => {
        page.value = p;
    };

    const setTrees = (t: MindStore["trees"]) => {
        trees.value = t;
    };

    return {
        getPage,
        getTrees,
        setPage,
        setTrees,
    };
});

export default useMindStore;
