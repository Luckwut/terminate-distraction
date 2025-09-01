import { getContext, setContext } from 'svelte';

export type Page = 'home' | 'ruleForm';

export type RouteParams = {
    id?: string;
};

export type Route = {
    name: Page;
    params: RouteParams;
};

export type Router = {
    route: Route;
    navigate: (name: Page, params?: RouteParams) => void;
};

const ROUTER_KEY = Symbol('router');

export function setRouterContext(router: Router) {
    setContext(ROUTER_KEY, router);
}

export function getRouterContext() {
    return getContext<Router>(ROUTER_KEY);
}