<script lang="ts">
  import wxtLogo from "@/assets/wxt.svg";
  import RuleItem from "@/lib/sidepanel/components/RuleItem.svelte";
  import { Settings } from "@lucide/svelte";
  import { router } from "@/lib/sidepanel/router.svelte";
  import { rulesStore } from "@/lib/data/rules/store.svelte";

  const loadPromise = rulesStore.load();
  const rules = $derived(rulesStore.rules);

  function navigateToRuleForm() {
    router.navigate({
      name: "ruleForm",
      params: {},
    });
  }
</script>

<header
  class="flex justify-between items-center py-2 px-3 border-b border-b-base-100"
>
  <div class="flex items-center gap-2">
    <img src={wxtLogo} alt="Terminate Distraction Logo" class="w-6" />
    <h1 class="text-lg font-bold">Terminate Distraction</h1>
  </div>

  <button class="cursor-pointer">
    <Settings size={20} />
  </button>
</header>

<div
  class="flex flex-col flex-1 items-center gap-2 p-2 min-h-0 overflow-y-auto topography-pattern scrollbar-hidden"
>
  {#await loadPromise then}
    {#each rules as { id, name, enabled, option } (id)}
      <RuleItem
        {id}
        {name}
        {enabled}
        dailyLimit={option.dailyLimit}
        unlockCount={0}
      />
    {/each}
  {/await}
</div>

<div class="flex justify-center items-center p-2 border-t border-t-base-100">
  <button
    class="btn btn-sm btn-soft btn-primary btn-wide rounded-full"
    onclick={navigateToRuleForm}
  >
    <span class="text-primary-content">Add New Rule</span>
  </button>
</div>
