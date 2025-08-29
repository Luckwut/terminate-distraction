<script lang="ts">
    import { ArrowLeft, ChevronDown, CirclePlus } from "@lucide/svelte";
    import SiteActionItem from "../components/SiteActionItem.svelte";
    import { getNavigationContext } from "../navigationContext";
    import { rules } from "@/lib/data";
    import { getSelectedRuleContext } from "../selectedRuleContext";

    const navigate = getNavigationContext();

    let isGeneralCollapsed = $state(false);
    const generalChevronClass = $derived(
        isGeneralCollapsed ? "" : "rotate-180",
    );

    let isOptionCollapsed = $state(true);
    const optionChevronClass = $derived(isOptionCollapsed ? "" : "rotate-180");

    let isActionCollapsed = $state(false);
    const actionChevronClass = $derived(isActionCollapsed ? "" : "rotate-180");

    const selectedRule = getSelectedRuleContext();
    const isNewRule = selectedRule.id === null;
    console.log(isNewRule);
    const { name, enabled, option, sites } = rules.find(r => r.id === selectedRule.id && !isNewRule) || {};

    let toggleActivate = $state(enabled || true);
    let nameInput = $state(name);

    const {
        dailyLimit,
        cooldownMin,
        unlockDurationMin,
        pauseBeforeUnlockSec,
        increasePausePerUnlockSec
    } = option || {
        dailyLimit: null,
        cooldownMin: null,
        unlockDurationMin: null,
        pauseBeforeUnlockSec: null,
        increasePausePerUnlockSec: null
    };
    let dailyLimitInput = $state(dailyLimit);
    let cooldownMinInput = $state(cooldownMin);
    let unlockDurationMinInput = $state(unlockDurationMin);
    let pauseBeforeUnlockSecInput = $state(pauseBeforeUnlockSec);
    let increasePausePerUnlockSecInput = $state(increasePausePerUnlockSec);

    function navigateToHome(e: MouseEvent | KeyboardEvent) {
        e.stopPropagation();
        navigate("home");
    }
</script>

<section>
    <div class="flex gap-2 items-center p-2">
        <button
            class="cursor-pointer"
            onclick={navigateToHome}
            onkeydown={navigateToHome}
            title="Return to Home"
        >
            <ArrowLeft size={20} class="hover:text-gray-400" />
        </button>
        <span>{isNewRule ? "Add New Rule" : "Edit Rule"}</span>
    </div>
</section>

<section>
    <div
        role="button"
        tabindex="0"
        class="flex justify-between items-center w-full p-2 cursor-pointer"
        onclick={() => (isGeneralCollapsed = !isGeneralCollapsed)}
        onkeydown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            (isGeneralCollapsed = !isGeneralCollapsed)}
    >
        <span>General</span>
        <ChevronDown
            size={20}
            class="transition-transform {generalChevronClass}"
        />
    </div>

    {#if !isGeneralCollapsed}
        <div class="flex flex-col">
            <div
                class="flex items-center justify-between bg-base-200 py-2 px-3"
            >
                <span>Rule Name</span>
                <input type="text" class="input input-sm w-52" bind:value={nameInput} />
            </div>
            <div
                class="flex items-center justify-between bg-base-200 py-2 px-3"
            >
                <span>Rule Enabled</span>
                <div class="flex items-center gap-2">
                    <span class="text-xs {toggleActivate ? '' : 'opacity-35'}">
                        {toggleActivate ? "Active" : "Disabled"}
                    </span>
                    <input
                        type="checkbox"
                        class="toggle toggle-primary checked:bg-primary checked:text-primary-content"
                        bind:checked={toggleActivate}
                    />
                </div>
            </div>
            <div
                class="flex items-center justify-between bg-base-200 py-2 px-3"
            >
                <span>Delete Rule</span>
                <button class="btn btn-error btn-soft btn-sm w-32">
                    Delete
                </button>
            </div>
        </div>
    {/if}
</section>

<section>
    <div
        role="button"
        tabindex="0"
        class="flex justify-between items-center w-full p-2 cursor-pointer"
        onclick={() => (isOptionCollapsed = !isOptionCollapsed)}
        onkeydown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            (isOptionCollapsed = !isOptionCollapsed)}
    >
        <span>Option</span>

        <div class="flex items-center gap-2">
            <span class="text-xs opacity-35">Optional</span>
            <ChevronDown
                size={20}
                class="transition-transform {optionChevronClass}"
            />
        </div>
    </div>

    {#if !isOptionCollapsed}
        <div class="flex flex-col">
            <div
                class="flex items-center justify-between bg-base-200 pb-1 pt-2 px-3"
            >
                <span>Daily limit</span>
                <div class="flex items-center mr-2">
                    <input type="number" class="input input-xs w-16" bind:value={dailyLimitInput} />
                    <span class="inline-block w-14 text-right">unlock</span>
                </div>
            </div>

            <div
                class="flex items-center justify-between bg-base-200 py-1 px-3"
            >
                <span>Unlock duration</span>
                <div class="flex items-center mr-2">
                    <input type="number" class="input input-xs w-16" bind:value={cooldownMinInput} />
                    <span class="inline-block w-14 text-right">minute</span>
                </div>
            </div>

            <div
                class="flex items-center justify-between bg-base-200 py-1 px-3"
            >
                <span>Cooldown between unlock</span>
                <div class="flex items-center mr-2">
                    <input type="number" class="input input-xs w-16" bind:value={unlockDurationMinInput} />
                    <span class="inline-block w-14 text-right">minute</span>
                </div>
            </div>

            <div
                class="flex items-center justify-between bg-base-200 py-1 px-3"
            >
                <span>Pause before unlock</span>
                <div class="flex items-center mr-2">
                    <input type="number" class="input input-xs w-16" bind:value={pauseBeforeUnlockSecInput} />
                    <span class="inline-block w-14 text-right">second</span>
                </div>
            </div>

            <div
                class="flex items-center justify-between bg-base-200 pb-2 pt-1 px-3"
            >
                <span>Increase pause time per unlock</span>
                <div class="flex items-center mr-2">
                    <input type="number" class="input input-xs w-16" bind:value={increasePausePerUnlockSecInput} />
                    <span class="inline-block w-14 text-right">second</span>
                </div>
            </div>
        </div>
    {/if}
</section>

<section>
    <div
        role="button"
        tabindex="0"
        class="flex justify-between items-center w-full p-2 cursor-pointer"
        onclick={() => (isActionCollapsed = !isActionCollapsed)}
        onkeydown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            (isActionCollapsed = !isActionCollapsed)}
    >
        <span>Action</span>

        <ChevronDown
            size={20}
            class="transition-transform {actionChevronClass}"
        />
    </div>

    {#if !isActionCollapsed}
        <div class="flex flex-col">
            <div
                class="flex items-center justify-between bg-base-200 py-2 px-3 gap-2"
            >
                <input
                    type="text"
                    class="input input-sm w-full"
                    placeholder="example: instagram.com/reels/*"
                />

                <button class="btn btn-sm btn-soft btn-primary w-24">
                    Add Site
                </button>
            </div>
        </div>

        {#if sites}
            {#each sites as site (site.id)}
                <SiteActionItem siteUrl={site.siteUrl} actions={site.actions} />
            {/each}
        {/if}
    {/if}
</section>
