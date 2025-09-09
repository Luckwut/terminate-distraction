<script lang="ts">
  import wxtLogo from "@/assets/wxt.svg";
  import RuleItem from "@/lib/sidepanel/components/RuleItem.svelte";
  import { Settings } from "@lucide/svelte";

  const test = [
    {
      id: "id-1",
      name: "Youtube",
      enabled: true,
      dailyLimit: 4,
      unlockCount: 1,
    },
    {
      id: "id-2",
      name: "Youtube",
      enabled: false,
      dailyLimit: 4,
      unlockCount: 0,
    },
  ];
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
  {#each test as t}
    <RuleItem {...t} />
  {/each}
</div>

<div class="flex justify-center items-center p-2 border-t border-t-base-100">
  <button class="btn btn-sm btn-soft btn-primary btn-wide rounded-full">
    <span class="text-primary-content">Add New Rule</span>
  </button>
</div>
