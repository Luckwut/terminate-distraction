import type { Rule } from "@/lib/types";

const RULES_STORAGE_KEY = "local:rules";

export async function setRuleStorage(rules: Rule[]) {
    await storage.setItem(RULES_STORAGE_KEY, rules);
}

export async function getRuleStorage(): Promise<Rule[] | null> {
    return await storage.getItem(RULES_STORAGE_KEY) as Rule[] | null;
}