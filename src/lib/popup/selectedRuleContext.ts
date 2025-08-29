import { setContext, getContext } from "svelte";

const SELECTED_RULE_CONTEXT_KEY = Symbol('selectedRule');

export function setSelectedRuleContext(id: { id: string | null }) {
    setContext(SELECTED_RULE_CONTEXT_KEY, id);
}

export function getSelectedRuleContext() {
    return getContext<{ id: string | null }>(SELECTED_RULE_CONTEXT_KEY);
}