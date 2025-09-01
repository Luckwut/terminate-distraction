<script lang="ts">
  import Header from "@/lib/popup/components/Header.svelte";
  import Home from "@/lib/popup/pages/Home.svelte";
  import RuleForm from "@/lib/popup/pages/RuleForm.svelte";
  import {
    type Page,
    type Route,
    type RouteParams,
    setRouterContext,
  } from "@/lib/popup/router";

  let currentRoute = $state<Route>({ name: "home", params: {} });

  const navigate = (name: Page, params: RouteParams = {}) => {
    currentRoute.name = name;
    currentRoute.params = params;
  };

  setRouterContext({
    route: currentRoute,
    navigate: navigate,
  });
</script>

<main class="w-96 flex flex-col text-sm">
  <Header />

  {#if currentRoute.name === "home"}
    <Home />
  {:else if currentRoute.name === "ruleForm"}
    <RuleForm id={currentRoute.params.id } />
  {/if}
</main>
