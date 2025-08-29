import { setContext, getContext } from "svelte";

export type Page = "home" | "rule_form";
export type NavigationFunction = (page: Page) => void;

const NAVIGATION_CONTEXT_KEY = Symbol('navigation');

export function setNavigationContext(navigate: NavigationFunction) {
	setContext(NAVIGATION_CONTEXT_KEY, navigate);
}

export function getNavigationContext() {
	return getContext<NavigationFunction>(NAVIGATION_CONTEXT_KEY);
}