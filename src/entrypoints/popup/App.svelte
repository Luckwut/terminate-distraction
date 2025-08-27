<script lang="ts">
  import { ChevronDown } from "@lucide/svelte";
  import RuleItem from "@/lib/components/RuleItem.svelte";
  import Header from "@/lib/components/Header.svelte";

  const rules = [
    {
      id: 1,
      name: "YouTube Feed",
      isActive: true,
      dailyLimit: 6,
      unlockCount: 0,
      unlockDurationMin: null,
      pauseBeforeUnlockSec: 5,
    },
    {
      id: 2,
      name: "Instagram Reels",
      isActive: true,
      dailyLimit: 6,
      unlockCount: 5,
      unlockDurationMin: 15,
      pauseBeforeUnlockSec: 5,
    },
    {
      id: 3,
      name: "Reddit Feed",
      isActive: true,
      dailyLimit: 2,
      unlockCount: 2,
      unlockDurationMin: null,
      pauseBeforeUnlockSec: null,
    },
    {
      id: 3,
      name: "Wikipedia",
      isActive: false,
      dailyLimit: 6,
      unlockCount: 0,
      unlockDurationMin: null,
      pauseBeforeUnlockSec: null,
    },
  ];

  let isActiveCollapsed = $state(false);
  let isDisabledCollapsed = $state(true);

  const activeChevronClass = $derived(isActiveCollapsed ? "" : "rotate-180");
  const disabledChevronClass = $derived(
    isDisabledCollapsed ? "" : "rotate-180",
  );

  const activeRules = $derived(rules.filter((r) => r.isActive));
  const disabledRules = $derived(rules.filter((r) => !r.isActive));

  function testPropagation(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation();
    console.log("Hello World");
  }
</script>

<main class="w-96 flex flex-col text-sm">
  <Header />

  <!-- Active Rules section -->
  <section>
    <div
      role="button"
      tabindex="0"
      class="flex justify-between items-center w-full p-2 cursor-pointer"
      onclick={() => (isActiveCollapsed = !isActiveCollapsed)}
      onkeydown={(e) =>
        (e.key === "Enter" || e.key === " ") &&
        (isActiveCollapsed = !isActiveCollapsed)}
    >
      <h2>Active Rules</h2>
      <div class="flex gap-2">
        <button
          class="btn btn-xs btn-soft"
          onclick={testPropagation}
          onkeydown={testPropagation}>Add New Rule</button
        >
        <ChevronDown
          size={20}
          class="transition-transform {activeChevronClass}"
        />
      </div>
    </div>

    {#if !isActiveCollapsed}
      <div class="max-h-32 overflow-y-auto scrollbar-thin">
        <div class="flex flex-col">
          {#each activeRules as rule (rule.id)}
            <RuleItem {...rule} />
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- Disabled Rules section -->
  <section>
    <div
      role="button"
      tabindex="0"
      class="flex justify-between w-full items-center p-2 cursor-pointer"
      onclick={() => (isDisabledCollapsed = !isDisabledCollapsed)}
      onkeydown={(e) =>
        (e.key === "Enter" || e.key === " ") &&
        (isDisabledCollapsed = !isDisabledCollapsed)}
    >
      <h2>Disabled Rules</h2>
      <ChevronDown
        size={20}
        class="transition-transform {disabledChevronClass}"
      />
    </div>

    {#if !isDisabledCollapsed}
      <div class="max-h-32 overflow-y-auto scrollbar-thin">
        <div class="flex flex-col">
          {#each disabledRules as rule (rule.id)}
            <RuleItem {...rule} />
          {/each}
        </div>
      </div>
    {/if}
  </section>
</main>
