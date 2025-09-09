<script lang="ts">
  import Home from "@/lib/sidepanel/pages/Home.svelte";
  import RuleForm from "@/lib/sidepanel/pages/RuleForm.svelte";
  import SiteActionForm from "@/lib/sidepanel/pages/SiteActionForm.svelte";
  import { router } from "@/lib/sidepanel/router.svelte";
  import { fly } from "svelte/transition";
</script>

<main class="flex flex-col bg-base-300 h-screen">
  <div class="relative flex-1 overflow-hidden">
    {#key router.currentRoute.name}
      <div
        class="absolute inset-0 flex flex-col"
        transition:fly={{ duration: 150, x: 1000 }}
      >
        {#if router.currentRoute.name === "home"}
          <Home />
        {:else if router.currentRoute.name === "ruleForm"}
          <RuleForm id={router.currentRoute.params.id} />
        {:else if router.currentRoute.name === "siteActionsForm"}
          <SiteActionForm />
        {/if}
      </div>
    {/key}
  </div>
</main>
