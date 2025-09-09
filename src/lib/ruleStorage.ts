import type { Rule } from "@/lib/rules/types";
import { ruleMockData } from "@/lib/ruleMockData"; // TEMPORARY

const RULES_STORAGE_KEY = "local:rules";

export async function setRuleStorage(rules: Rule[]) {
    await storage.setItem(RULES_STORAGE_KEY, rules);
}

export async function getRuleStorage(): Promise<Rule[] | null> {
    return await storage.getItem(RULES_STORAGE_KEY) as Rule[] | null;
}

export async function initMockData() {
    const existing = await getRuleStorage();
    if (!existing || existing.length === 0) {
        await setRuleStorage(ruleMockData);
    }
}