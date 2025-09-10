import { Rule } from "@/lib/data/rules/types";
import { presetData } from "@/lib/data/rules/presetData";

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

    get nonProxyRules(): Rule[] {
        return $state.snapshot(data) ?? [];
    },

    async load() {
        // If `loader` still running, reuse it
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

export async function initPresetData() {
    const existing = await getRuleStorage();
    if (!existing || existing.length === 0) {
        await setRuleStorage(presetData);
    }
}

export { rulesStorage };