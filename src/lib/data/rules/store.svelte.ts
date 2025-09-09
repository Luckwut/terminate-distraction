import { Rule } from "@/lib/data/rules/types";
import { initialData } from "@/lib/data/rules/initialData";

const RULES_STORAGE_KEY = "local:rules";
const rulesStorage = storage.defineItem<Rule[]>(RULES_STORAGE_KEY, {
    fallback: []
});

async function setRuleStorage(rules: Rule[]) {
    await rulesStorage.setValue(rules);
}

async function getRuleStorage(): Promise<Rule[]> {
    return await rulesStorage.getValue();
}

let data = $state<Rule[] | null>(null);

// tracks ongoing load to avoid duplicates (only one load at a time)
let loader: Promise<void> | null = null;

export const rulesStore = {
    get rules() {
        return data ?? [];
    },

    async load() {
        // If `loader` still running, reuse it
        if (data !== null) return Promise.resolve();
        if (loader) return loader;

        // otherwise, start loading
        loader = (async () => {
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

        // don't store proxy state into the storage
        const raw = $state.snapshot(newRules);
        await setRuleStorage(raw);
    }
};

export async function initInitialData() {
    const existing = await getRuleStorage();
    if (!existing || existing.length === 0) {
        await setRuleStorage(initialData);
    }
}