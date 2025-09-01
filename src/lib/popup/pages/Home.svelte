<script lang="ts">
    import { ChevronDown, Plus } from "@lucide/svelte";
    import RuleItem from "@/lib/popup/components/RuleItem.svelte";
    import { rules } from "@/lib/mockData";
    import { getRouterContext } from "@/lib/popup/router";

    const { navigate } = getRouterContext();

    let isActiveCollapsed = $state(false);
    const activeChevronClass = $derived(isActiveCollapsed ? "" : "rotate-180");

    let isDisabledCollapsed = $state(true);
    const disabledChevronClass = $derived(
        isDisabledCollapsed ? "" : "rotate-180",
    );

    const activeRules = $derived(rules.filter((r) => r.enabled));
    const disabledRules = $derived(rules.filter((r) => !r.enabled));

    function goToAddRuleForm(e: MouseEvent | KeyboardEvent) {
        e.stopPropagation(); // TODO: Explanation
        navigate("ruleForm");
    }
</script>

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
                class="cursor-pointer"
                onclick={goToAddRuleForm}
                onkeydown={goToAddRuleForm}
                title="Add New Rule"
            >
                <Plus size={20} class="hover:text-gray-400" />
            </button>
            <ChevronDown
                size={20}
                class="transition-transform {activeChevronClass}"
            />
        </div>
    </div>

    {#if !isActiveCollapsed}
        <div class="max-h-64 overflow-y-auto scrollbar-thin">
            <div class="flex flex-col">
                {#each activeRules as rule (rule.id)}
                    <RuleItem
                        id={rule.id}
                        name={rule.name}
                        enabled={rule.enabled}
                        dailyLimit={rule.option.dailyLimit}
                        unlockCount={0}
                        unlockDurationMinute={rule.option.unlockDurationMinute}
                        pauseBeforeUnlockSecond={rule.option.pauseBeforeUnlockSecond}
                    />
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
        <div class="max-h-64 overflow-y-auto scrollbar-thin">
            <div class="flex flex-col">
                {#each disabledRules as rule (rule.id)}
                    <RuleItem
                        id={rule.id}
                        name={rule.name}
                        enabled={rule.enabled}
                        dailyLimit={rule.option.dailyLimit}
                        unlockCount={0}
                        unlockDurationMinute={rule.option.unlockDurationMinute}
                        pauseBeforeUnlockSecond={rule.option.pauseBeforeUnlockSecond}
                    />
                {/each}
            </div>
        </div>
    {/if}
</section>
