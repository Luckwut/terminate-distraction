<script lang="ts">
    import {
        ArrowLeft,
        ChevronDown,
        CircleAlert,
        CircleQuestionMark,
    } from "@lucide/svelte";
    import SiteActionItem from "@/lib/popup/components/SiteActionItem.svelte";
    import { getRouterContext } from "@/lib/popup/router";
    import type { Rule, Site } from "@/lib/types";
    import { rulesStore } from "@/lib/ruleStore.svelte";

    interface Props {
        id?: string | null;
    }

    let { id = null }: Props = $props();

    const { navigate } = getRouterContext();

    rulesStore.load();

    let form = $state<Rule | null>(null);

    $effect(() => {
        const rules = rulesStore.rules;

        if (rules === null) return;

        let initialFormState: Rule;
        if (id) {
            const ruleToEdit = rules.find((r) => r.id === id);
            if (ruleToEdit) {
                const raw = $state.snapshot(ruleToEdit);
                initialFormState = structuredClone(raw);
            } else {
                // TODO: Better error handling?
                console.error(`Rule with id ${id} not found!`);
                navigate("home");
                return;
            }
        } else {
            initialFormState = {
                id: crypto.randomUUID(),
                name: "",
                enabled: true,
                option: {
                    dailyLimit: 0,
                    cooldownMinute: 0,
                    unlockDurationMinute: 0,
                    pauseBeforeUnlockSecond: 0,
                    increasePausePerUnlockSecond: 0,
                },
                sites: [],
            };
        }

        form = initialFormState;
    });

    let addSiteInput = $state("");

    const isEditMode = $derived(id !== null);

    let isGeneralCollapsed = $state(false);
    const generalChevronClass = $derived(
        isGeneralCollapsed ? "" : "rotate-180",
    );

    let isOptionCollapsed = $state(true);
    const optionChevronClass = $derived(isOptionCollapsed ? "" : "rotate-180");

    let isSiteCollapsed = $state(false);
    const siteChevronClass = $derived(isSiteCollapsed ? "" : "rotate-180");

    let buttonSectionBgColorClass = $derived.by(() => {
        if (!isSiteCollapsed && form?.sites.length !== 0) {
            return "bg-base-300";
        }

        return isSiteCollapsed ? "bg-base-100" : "bg-base-200";
    });

    function hanldeAddSite(e: SubmitEvent) {
        e.preventDefault();

        if (!form) return;
        if (!addSiteInput.trim()) return;

        // PLACEHOLDER: Only block page for MVP!
        const site: Site = {
            id: crypto.randomUUID(),
            siteUrl: addSiteInput.trim(),
            actions: [
                {
                    id: crypto.randomUUID(),
                    type: "BLOCK_PAGE",
                    label: `${form?.name} BLOCK`,
                },
            ],
        };

        form?.sites.push(site);
        addSiteInput = "";
    }

    function handleDeleteSite(siteId: string) {
        if (!form) return;
        form.sites = form.sites.filter((s) => s.id !== siteId);
    }

    function handleSubmit() {
        if (!form) return;
        const rules = rulesStore.rules;
        if (rules === null) return;

        // TODO: Name cannot be empty hint?
        if (!form.name.trim()) return;
        form.name = form.name.trim();

        // Normalize blank option inputs to 0
        for (const key in form.option) {
            const optionKey = key as keyof Rule["option"];
            form.option[optionKey] = Number(form.option[optionKey]) || 0;
        }

        const updatedRules = isEditMode
            ? rules.map((r) => (r.id === id ? form! : r))
            : [...rules, form];

        rulesStore.update(updatedRules);
        navigate("home");
    }

    function handleDeleteRule() {
        if (!id) return;
        const rules = rulesStore.rules;
        if (rules === null) return;

        // TODO: Add confirmation
        const updatedRules = rules.filter((r) => r.id !== id);
        rulesStore.update(updatedRules);
        navigate("home");
    }

    function goToEditHomeForm(e: MouseEvent | KeyboardEvent) {
        if (e instanceof KeyboardEvent && e.key !== "Enter" && e.key !== " ")
            return;

        e.stopPropagation();
        navigate("home");
    }
</script>

{#if form}
    <section>
        <div class="flex gap-2 items-center p-2">
            <button
                class="cursor-pointer"
                onclick={goToEditHomeForm}
                onkeydown={goToEditHomeForm}
                title="Return to Home"
            >
                <ArrowLeft size={20} class="hover:text-gray-400" />
            </button>
            <span>{isEditMode ? "Edit Rule" : "Add New Rule"}</span>
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
                    <input
                        type="text"
                        class="input input-sm w-52"
                        placeholder="Name cannot be empty!"
                        bind:value={form.name}
                    />
                </div>
                <div
                    class="flex items-center justify-between bg-base-200 py-2 px-3"
                >
                    <span>Rule Enabled</span>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-xs {form.enabled ? '' : 'opacity-35'}"
                        >
                            {form.enabled ? "Active" : "Disabled"}
                        </span>
                        <input
                            type="checkbox"
                            class="toggle toggle-primary checked:bg-primary checked:text-primary-content"
                            bind:checked={form.enabled}
                        />
                    </div>
                </div>
                {#if isEditMode}
                    <div
                        class="flex items-center justify-between bg-base-200 py-2 px-3"
                    >
                        <span>Delete Rule</span>
                        <button
                            class="btn btn-error btn-soft btn-sm w-32"
                            onclick={handleDeleteRule}
                        >
                            Delete
                        </button>
                    </div>
                {/if}
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
            <span>Additional Options</span>

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
                    <div class="flex items-center gap-2">
                        <span>Daily limit</span>
                        <div class="tooltip">
                            <div
                                class="tooltip-content translate-x-24 text-left"
                            >
                                <span class="text-xs font-mono">
                                    Hard daily limit for unlock
                                    attempts.Example: if set to 6, after 6
                                    unlocks, the rule cannot be unlocked again
                                    that day.
                                </span>
                            </div>
                            <CircleQuestionMark
                                size={12}
                                class="text-gray-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            min="0"
                            bind:value={form.option.dailyLimit}
                        />
                        <span class="inline-block w-14 text-right">unlock</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 py-1 px-3"
                >
                    <div class="flex items-center gap-2">
                        <span>Unlock Duration</span>
                        <div class="tooltip">
                            <div
                                class="tooltip-content translate-x-12 text-left"
                            >
                                <span class="text-xs font-mono">
                                    How long the site stays unlocked. If blank
                                    or 0, the user will be prompted to choose a
                                    duration during unlock.
                                </span>
                            </div>
                            <CircleQuestionMark
                                size={12}
                                class="text-gray-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            min="0"
                            bind:value={form.option.unlockDurationMinute}
                        />
                        <span class="inline-block w-14 text-right">minute</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 py-1 px-3"
                >
                    <div class="flex items-center gap-2">
                        <span>Cooldown between unlock</span>
                        <div class="tooltip">
                            <div class="tooltip-content">
                                <span class="text-xs font-mono">
                                    The waiting time before the site can be
                                    unlocked again after it becomes locked.
                                </span>
                            </div>
                            <CircleQuestionMark
                                size={12}
                                class="text-gray-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            min="0"
                            bind:value={form.option.cooldownMinute}
                        />
                        <span class="inline-block w-14 text-right">minute</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 py-1 px-3"
                >
                    <div class="flex items-center gap-2">
                        <span>Pause before unlock</span>
                        <div class="tooltip">
                            <div
                                class="tooltip-content translate-x-8 text-left"
                            >
                                <span class="text-xs font-mono">
                                    Delay before confirming unlock in the 'Are
                                    you sure?' prompt. The Yes button stays
                                    disabled until the countdown ends. Set to 0
                                    for no delay.
                                </span>
                            </div>
                            <CircleQuestionMark
                                size={12}
                                class="text-gray-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            min="0"
                            bind:value={form.option.pauseBeforeUnlockSecond}
                        />
                        <span class="inline-block w-14 text-right">second</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 pb-2 pt-1 px-3"
                >
                    <div class="flex items-center gap-2">
                        <span>Increase pause time per unlock</span>
                        <div class="tooltip">
                            <div class="tooltip-content -translate-x-6">
                                <span class="text-xs font-mono">
                                    Extra countdown time added in the 'Are you
                                    sure?' prompt for each unlock. This delay
                                    resets daily.
                                </span>
                            </div>
                            <CircleQuestionMark
                                size={12}
                                class="text-gray-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            min="0"
                            bind:value={
                                form.option.increasePausePerUnlockSecond
                            }
                        />
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
            onclick={() => (isSiteCollapsed = !isSiteCollapsed)}
            onkeydown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                (isSiteCollapsed = !isSiteCollapsed)}
        >
            <span>Targeted Sites</span>

            <ChevronDown
                size={20}
                class="transition-transform {siteChevronClass}"
            />
        </div>

        {#if !isSiteCollapsed}
            <div class="flex flex-col">
                <form
                    class="flex items-center justify-between bg-base-200 py-2 px-3 gap-2"
                    onsubmit={hanldeAddSite}
                >
                    <label class="input input-sm">
                        <input
                            type="text"
                            class="grow"
                            placeholder="example: instagram.com/reels/*"
                            bind:value={addSiteInput}
                        />
                        <div class="tooltip">
                            <div class="tooltip-content -translate-x-16">
                                <span class="text-xs font-mono">
                                    No need for `http://` or `https://`. Use `*`
                                    as a wildcard. Example:
                                    `youtube.com/shorts/*` targets all YouTube
                                    shorts.
                                </span>
                            </div>
                            <CircleAlert
                                size={16}
                                class="text-gray-600 cursor-pointer"
                            />
                        </div>
                    </label>

                    <button
                        class="btn btn-sm btn-soft btn-primary w-24"
                        type="submit"
                    >
                        Add Site
                    </button>
                </form>
            </div>

            {#if form.sites}
                {#each form.sites as site (site.id)}
                    <SiteActionItem {site} {handleDeleteSite} />
                {/each}
            {/if}
        {/if}
    </section>

    <div
        class="flex justify-center items-center w-full p-2 bg-base-100 {buttonSectionBgColorClass}"
    >
        <button
            class="btn btn-sm btn-soft btn-primary btn-wide"
            onclick={handleSubmit}
        >
            Save
        </button>
    </div>
{:else}
    <div class="p-4 text-center">Loading form...</div>
{/if}

<!-- Delete Modal -->
<!-- <dialog class="modal" bind:this={dialogElement}>
    <div class="modal-box p-4 w-70">
        <h3 class="text-lg font-bold">Are you sure?</h3>
        <p class="mt-2">Delete "Block Reels" action</p>
        <div class="modal-action flex">
            <form method="dialog" class="flex-1">
                <button class="btn btn-sm btn-soft w-full">Close</button>
            </form>
            <div class="flex-1">
                <button class="btn btn-sm btn-soft btn-error w-full">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</dialog> -->
