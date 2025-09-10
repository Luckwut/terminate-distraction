type Page = 'home' | 'ruleForm' | 'siteActionsForm';

type RouteParams = {
  id?: string;
};

type Route =
  | { name: 'home'; params: {} }
  | { name: 'ruleForm'; params: { id?: string } }
  | { name: 'siteActionsForm'; params: { id: string } };

let routeStack = $state<Route[]>([
  {
    name: "home",
    params: {}
  }
]);
let currentRoute = $derived(routeStack[routeStack.length - 1]);

export const router = {
  get currentRoute() {
    return currentRoute;
  },
  push(route: Route) {
    routeStack.push(route);
  },
  pop() {
    routeStack.pop();
  },
}