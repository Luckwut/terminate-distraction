type Page = 'home' | 'ruleForm' | 'siteActionsForm';

type RouteParams = {
    id?: string;
};

type Route = {
    name: Page;
    params: RouteParams;
};

let currentRoute = $state<Route>({
    name: 'home',
    params: {}
});

export const router = {
    get currentRoute() {
        return currentRoute;
    },
    navigate(name: Page, params: RouteParams = {}) {
        currentRoute.name = name;
        currentRoute.params = params;
    }
}