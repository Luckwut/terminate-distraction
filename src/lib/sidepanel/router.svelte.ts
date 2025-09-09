type Page = 'home' | 'ruleForm' | 'siteActionsForm';

type RouteParams = {
  id?: string;
};

type Route =
  | { name: 'home'; params: {} }
  | { name: 'ruleForm'; params: { id?: string } }
  | { name: 'siteActionsForm'; params: { ruleId: string; siteId: string } };

let currentRoute = $state<Route>({
  name: 'home',
  params: {}
});

export const router = {
  get currentRoute() {
    return currentRoute;
  },
  navigate(route: Route) {
    currentRoute.name = route.name;
    currentRoute.params = route.params;
  }
}