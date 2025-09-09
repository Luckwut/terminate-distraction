<script lang="ts">
    import { Settings2 } from "@lucide/svelte";
    import { router } from "@/lib/sidepanel/router.svelte";

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
            return buttonDisabled;
        }

        if (p.unlockCount >= p.dailyLimit && hasDailyLimit) {
            return buttonLocked;
        }

        return buttonUnlock;
    });

    const displayDailyLimitClass = $derived.by(() => {
        if (!p.enabled) {
            return "text-base-content/35";
        }

        if (p.unlockCount + 1 === p.dailyLimit && hasDailyLimit) {
            return "text-yellow-600";
        }

        if (p.unlockCount === p.dailyLimit && hasDailyLimit) {
            return "text-red-600";
        }

        return "text-green-600";
    });

    function navigateToRuleForm() {
        router.navigate({
            name: "ruleForm",
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
        class="btn btn-xs btn-soft btn-primary rounded-full px-4 pointer-events-none tabular-nums"
    >
        Unlocked 10:00
    </div>
{/snippet}

{#snippet buttonCooldownTimer()}
    <div
        class="btn btn-xs btn-soft btn-warning rounded-full px-4 pointer-events-none tabular-nums"
    >
        Cooldown 10:00
    </div>
{/snippet}

{#snippet buttonLocked()}
    <button
        class="btn btn-xs btn-soft btn-error rounded-full px-4 pointer-events-none"
    >
        Locked
    </button>
{/snippet}

{#snippet buttonDisabled()}
    <button class="btn btn-xs rounded-full px-4" disabled>Disabled</button>
{/snippet}

<div
    class="flex flex-col gap-2 bg-base-100 shadow rounded-xl p-2 max-w-lg w-full"
>
    <div class="flex flex-1 gap-2 items-center text-sm">
        <span class="flex flex-1 items-center gap-2 min-w-0">
            <span class="font-semibold {displayDailyLimitClass}">
                {formatUnlockCount}
            </span>
            <span class="flex-1 break-all">
                {p.name}
            </span>
        </span>
        {@render displayButton()}
    </div>
    <span class="border-t border-base-content/10"></span>
    <div class="flex flex-1 justify-between items-center text-xs">
        <span class="flex gap-1 items-center">
            <span class="text-base-content/35">AREA TODO</span>
        </span>
        <span class="flex gap-2 items-center">
            <span class="text-base-content/35">0 days streak</span>
            <button
                class="btn btn-xs btn-soft hover:btn-primary btn-circle"
                onclick={navigateToRuleForm}
            >
                <Settings2 size={12} />
            </button>
        </span>
    </div>
</div>
