<script lang="ts">
  import wxtLogo from '@/assets/wxt.svg';
  import RuleItem from '@/lib/sidepanel/components/RuleItem.svelte';
  import { Settings } from '@lucide/svelte';
  import { router } from '@/lib/sidepanel/router.svelte';
  import { rulesStore } from '@/lib/data/rules/store.svelte';
  import { ruleFormStore } from '@/lib/sidepanel/ruleFormStore.svelte';

  const loadPromise = rulesStore.load();
  const rules = $derived(rulesStore.rules);

  function navigateToRuleForm() {
    ruleFormStore.reset();
    router.push({
      name: 'ruleForm',
      params: {},
    });
  }
</script>

<header
  class="border-b-base-100 flex items-center justify-between border-b px-3 py-2">
  <div class="flex items-center gap-2">
    <img src={wxtLogo} alt="Terminate Distraction Logo" class="w-6" />
    <h1 class="text-lg font-bold">Terminate Distraction</h1>
  </div>

  <button class="cursor-pointer">
    <Settings size={20} />
  </button>
</header>

<div
  class="topography-pattern scrollbar-hidden flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto p-2">
  {#await loadPromise then}
    {#each rules as { id, name, enabled, option } (id)}
      <RuleItem
        {id}
        {name}
        {enabled}
        dailyLimit={option.dailyLimit}
        unlockCount={0} />
    {/each}
  {/await}
</div>

<div class="border-t-base-100 flex items-center justify-center border-t p-2">
  <button
    class="btn btn-sm btn-soft btn-primary btn-wide rounded-full"
    onclick={navigateToRuleForm}>
    <span class="text-primary-content">Add New Rule</span>
  </button>
</div>
