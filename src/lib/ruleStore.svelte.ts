import type { Rule } from "@/lib/types";
import { getRuleStorage, initMockData, setRuleStorage } from "@/lib/ruleStorage";

let data = $state<Rule[] | null>(null);

// Tracks ongoing load to avoid duplicates (only one load at a time)
let loader: Promise<void> | null = null;

export const rulesStore = {
    get rules() {
        return data;
    },

    async load() {
        // If `loader` still running, reuse it
        if (data !== null || loader) {
            return loader;
        }

        // otherwise, start loading
        loader = (async () => {
            await initMockData(); // TEMPORARY

            const rulesFromStorage = await getRuleStorage();
            data = rulesFromStorage ?? [];
        })();

        // wait for `loader` to finish, then reset
        try {
            await loader;
        } finally {
            loader = null;
        }
    },

    async update(newRules: Rule[]) {
        data = newRules;
        await setRuleStorage(newRules);
    }
};