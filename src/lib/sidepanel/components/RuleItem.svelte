<script lang="ts">
  import { Settings2 } from '@lucide/svelte';
  import { router } from '@/lib/sidepanel/router.svelte';

  interface Props {
    id: string;
    name: string;
    enabled: boolean;
    dailyLimit: number;
    unlockCount: number;
  }

  let p: Props = $props();

  const hasDailyLimit = $derived(p.dailyLimit !== 0);

  const formatUnlockCount = $derived.by(() => {
    if (hasDailyLimit) {
      return `${p.unlockCount}/${p.dailyLimit}`;
    }
    return `${p.unlockCount}/∞`;
  });

  const displayButton = $derived.by(() => {
    if (!p.enabled) {
      return null;
    }

    if (p.unlockCount >= p.dailyLimit && hasDailyLimit) {
      return buttonLocked;
    }

    return buttonUnlock;
  });

  const displayDailyLimitClass = $derived.by(() => {
    if (!p.enabled) {
      return 'text-base-content/35';
    }

    if (p.unlockCount + 1 === p.dailyLimit && hasDailyLimit) {
      return 'text-yellow-600';
    }

    if (p.unlockCount === p.dailyLimit && hasDailyLimit) {
      return 'text-red-600';
    }

    return 'text-green-600';
  });

  const displayStatusBadge = $derived.by(() => {
    if (!p.enabled) {
      return badgeDisabled;
    }

    return badgeActive;
  });

  function navigateToRuleForm() {
    router.push({
      name: 'ruleForm',
      params: { id: p.id },
    });
  }
</script>

{#snippet buttonUnlock()}
  <button class="btn btn-xs btn-soft hover:btn-primary rounded-full px-4">
    Unlock
  </button>
{/snippet}

{#snippet buttonUnlockedTimer()}
  <div
    class="btn btn-xs btn-soft btn-accent pointer-events-none rounded-full px-4 tabular-nums">
    10:00
  </div>
{/snippet}

{#snippet buttonCooldownTimer()}
  <div
    class="btn btn-xs btn-soft btn-warning pointer-events-none rounded-full px-4 tabular-nums">
    10:00
  </div>
{/snippet}

{#snippet buttonLocked()}
  <button
    class="btn btn-xs btn-soft btn-error pointer-events-none rounded-full px-4">
    Locked
  </button>
{/snippet}

{#snippet badgeActive()}
  <span class="badge badge-xs badge-primary badge-soft">Active</span>
{/snippet}

{#snippet badgeUnlocked()}
  <span class="badge badge-xs badge-accent badge-soft">Unlocked</span>
{/snippet}

{#snippet badgeCooldown()}
  <span class="badge badge-xs badge-warning badge-soft">Cooldown</span>
{/snippet}

{#snippet badgeLocked()}
  <span class="badge badge-xs badge-error badge-soft">Locked</span>
{/snippet}

{#snippet badgeDisabled()}
  <span class="badge badge-xs badge-soft">Disabled</span>
{/snippet}

<div
  class="bg-base-100 flex w-full max-w-lg flex-col gap-2 rounded-xl p-2 shadow">
  <div class="flex flex-1 items-center gap-2 text-sm">
    <span class="flex min-w-0 flex-1 items-center gap-2">
      <span class="font-semibold {displayDailyLimitClass}">
        {formatUnlockCount}
      </span>
      <span class="flex-1 break-all">
        {p.name}
      </span>
    </span>
    {@render displayButton?.()}
  </div>
  <span class="border-base-content/10 border-t"></span>
  <div class="flex flex-1 items-center justify-between text-xs">
    <span class="flex items-center gap-1">
      <span class="text-base-content/35">Status:</span>
      {@render displayStatusBadge()}
    </span>
    <span class="flex items-center gap-2">
      <span class="text-base-content/35">0 days streak</span>
      <button
        class="btn btn-xs btn-soft hover:btn-primary btn-circle"
        onclick={navigateToRuleForm}>
        <Settings2 size={12} />
      </button>
    </span>
  </div>
</div>
