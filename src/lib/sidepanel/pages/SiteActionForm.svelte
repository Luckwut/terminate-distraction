<script lang="ts">
    import {
        ArrowLeft,
        CircleQuestionMark,
        MousePointerClick,
        Pencil,
        PencilOff,
        Trash,
    } from "@lucide/svelte";
    import { router } from "@/lib/sidepanel/router.svelte";
    import type { HideElementAction, Site } from "@/lib/data/rules/types";
    import { ruleFormStore } from "@/lib/sidepanel/ruleFormStore.svelte";
    import { slide } from "svelte/transition";
    import { onMessage, sendMessage } from "@/lib/messaging";

    interface Props {
        id: string;
    }

    let { id }: Props = $props();

    function getSiteData() {
        const snapshotRule = $state.snapshot(ruleFormStore.currentRule);
        return snapshotRule.sites.find((r) => r.id === id)!;
    }

    function hasBlockPage(site: Site) {
        return site.actions.some((action) => action.type === "BLOCK_PAGE");
    }

    let site = $state<Site>(getSiteData());
    let blockedToggle = $state(hasBlockPage(site));
    let hideElementInput = $state({
        id: "",
        label: "",
        selector: "",
    });
    let trackEmptyInputs = $state({
        siteUrl: false,
        label: false,
        selector: false,
    });
    let isSelectorMode = $state(false);
    let currentUrl = $state("");
    let showWarning = $state(false);
    const rawSiteUrl = $state.snapshot(site.siteUrl);
    let currentTabId = $state<number | undefined>(undefined);

    onMount(async () => {
        currentTabId = await sendMessage("getCurrentTabId");
        currentUrl = await sendMessage("getCurrentSiteUrl");
        const pattern = new MatchPattern(`*://${site.siteUrl}`);
        showWarning = !pattern.includes(currentUrl);
    });

    onDestroy(async () => {
        await sendMessage("disableSelectorMode", undefined, currentTabId);
    });

    $effect(() => {
        const removeListener = onMessage("selectElementSelector", (message) => {
            hideElementInput.selector = message.data;
            isSelectorMode = false;
            sendMessage("disableSelectorMode", undefined, currentTabId);
        });

        return removeListener;
    });

    async function toggleSelectorMode() {
        isSelectorMode = !isSelectorMode;
        if (isSelectorMode) {
            await sendMessage("enableSelectorMode", undefined, currentTabId);
        } else {
            await sendMessage("disableSelectorMode", undefined, currentTabId);
        }
    }

    function navigateToRuleForm() {
        router.pop();
    }

    function handleDeleteAction(id: string) {
        const updatedActions = site.actions.filter((a) => a.id !== id);
        site.actions = updatedActions;
    }

    function handleEditAction(action: HideElementAction) {
        hideElementInput.id = action.id;
        hideElementInput.label = action.label;
        hideElementInput.selector = action.selector;
    }

    function handleCancelEditAction() {
        hideElementInput.id = "";
        hideElementInput.label = "";
        hideElementInput.selector = "";
    }

    function handleSaveAction() {
        if (hideElementInput.label.trim() === "") trackEmptyInputs.label = true;
        if (hideElementInput.selector.trim() === "")
            trackEmptyInputs.selector = true;

        if (
            hideElementInput.label.trim() === "" ||
            hideElementInput.selector.trim() === ""
        ) {
            return;
        }

        const hideElement: HideElementAction = {
            id: hideElementInput.id ? hideElementInput.id : crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: hideElementInput.label,
            selector: hideElementInput.selector,
        };

        const actionExists = site.actions.some(
            (a) => a.id === hideElementInput.id,
        );

        if (actionExists) {
            site.actions = site.actions.map((a) =>
                a.id === hideElementInput.id ? { ...hideElement } : a,
            );
        } else {
            site.actions.push(hideElement);
        }

        hideElementInput.id = "";
        hideElementInput.label = "";
        hideElementInput.selector = "";
    }

    function handleRemoveSite() {
        const updatedSites = ruleFormStore.currentRule.sites.filter(
            (s) => s.id !== id,
        );
        ruleFormStore.currentRule.sites = updatedSites;
        navigateToRuleForm();
    }

    function handleSaveSite() {
        if (site.siteUrl.trim() === "") {
            trackEmptyInputs.siteUrl = true;
            return;
        }

        if (blockedToggle && !hasBlockPage(site)) {
            site.actions.push({
                id: crypto.randomUUID(),
                type: "BLOCK_PAGE",
            });
        } else {
            site.actions = site.actions.filter((a) => a.type !== "BLOCK_PAGE");
        }

        ruleFormStore.currentRule.sites = ruleFormStore.currentRule.sites.map(
            (s) => (s.id === site.id ? { ...site } : s),
        );
        navigateToRuleForm();
    }
</script>

<header class="flex items-center py-2 px-3 border-b border-b-base-100">
    <div class="flex items-center gap-2">
        <button class="cursor-pointer" onclick={navigateToRuleForm}>
            <ArrowLeft size={20} />
        </button>
        <h1 class="text-lg">Site Actions</h1>
    </div>
</header>

<div
    class="flex flex-col flex-1 items-center gap-2 p-2 min-h-0 overflow-y-auto topography-pattern scrollbar-hidden"
>
    <div
        class="flex flex-col gap-2 bg-base-100 shadow rounded-lg p-3 max-w-lg w-full"
    >
        <h1 class="text-lg">Configure</h1>

        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-1 mb-2">
                <span>Site URL</span>
                <label
                    class="input input-sm w-full {trackEmptyInputs.siteUrl
                        ? 'input-error'
                        : ''}"
                >
                    <span>https://</span>
                    <input
                        type="text"
                        class="grow"
                        placeholder="www.youtube.com/shorts/*"
                        oninput={() => {
                            trackEmptyInputs.siteUrl = false;
                        }}
                        bind:value={site.siteUrl}
                    />
                </label>
                {#if trackEmptyInputs.siteUrl}
                    <span class="text-error text-xs" transition:slide>
                        This field cannot be left empty
                    </span>
                {/if}
                {#if showWarning}
                    <span class="text-warning text-xs " transition:slide>
                        Warning: Current page (<span class="break-words">{currentUrl}</span>) does not match the site
                        pattern (<span class="break-words">{rawSiteUrl}</span>). Selectors may not apply.
                    </span>
                {/if}
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                    <span>Block Site</span>
                    <CircleQuestionMark
                        size={12}
                        class="text-gray-600 hover:text-primary transition cursor-pointer"
                    />
                </div>
                <input
                    type="checkbox"
                    class="toggle toggle-primary toggle-sm checked:bg-primary checked:text-primary-content"
                    title="Block this site"
                    bind:checked={blockedToggle}
                />
            </div>

            <div class="flex items-center justify-between">
                <span>Remove Site</span>
                <button
                    class="btn btn-error btn-soft btn-xs px-4 rounded-xl"
                    title="Remove this site"
                    onclick={handleRemoveSite}
                >
                    Remove
                </button>
            </div>
        </div>
    </div>

    <div
        class="flex flex-col gap-2 bg-base-100 shadow rounded-lg p-3 max-w-lg w-full"
    >
        <span class="flex items-center gap-2">
            <h1 class="text-lg">Hide Element</h1>
            <CircleQuestionMark
                size={12}
                class="text-gray-600 hover:text-primary transition cursor-pointer"
            />
        </span>

        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-1">
                <span>Label</span>
                <input
                    type="text"
                    class="input input-sm {trackEmptyInputs.label
                        ? 'input-error'
                        : ''}"
                    oninput={() => {
                        trackEmptyInputs.label = false;
                    }}
                    bind:value={hideElementInput.label}
                />
                {#if trackEmptyInputs.label}
                    <span class="text-error text-xs" transition:slide>
                        This field cannot be left empty
                    </span>
                {/if}
            </div>
            <div class="flex flex-col gap-1">
                <span>Selector</span>
                <textarea
                    class="textarea textarea-xs font-mono min-h-16 {trackEmptyInputs.selector
                        ? 'textarea-error'
                        : ''}"
                    oninput={() => {
                        trackEmptyInputs.selector = false;
                    }}
                    bind:value={hideElementInput.selector}
                ></textarea>
                {#if trackEmptyInputs.selector}
                    <span class="text-error text-xs" transition:slide>
                        This field cannot be left empty
                    </span>
                {/if}
            </div>
            <div class="flex gap-2">
                <button
                    class="flex-1 btn btn-primary btn-soft btn-sm rounded-lg"
                    title="Add element into the 'Hide Element' list"
                    onclick={handleSaveAction}
                >
                    {hideElementInput.id ? "Update" : "Add"}
                </button>
                <button
                    class="btn btn-secondary {isSelectorMode ? '' : 'btn-soft'} btn-sm rounded-lg"
                    title="Select an element from the current website"
                    onclick={toggleSelectorMode}
                >
                    <MousePointerClick size={20} />
                </button>
            </div>
        </div>

        <div class="flex flex-col p-2 bg-base-200 rounded text-sm mt-2">
            {#each site.actions as action}
                {#if action.type === "HIDE_ELEMENT"}
                    <div
                        class="flex justify-between items-center gap-2 group cursor-default hover:bg-base-100 p-2 rounded"
                    >
                        <span class="flex-1 break-all">
                            {action.label}
                        </span>
                        {#if hideElementInput.id === action.id}
                            <button
                                class="cursor-pointer text-primary drop-shadow-lg drop-shadow-primary"
                                title="Edit"
                                onclick={handleCancelEditAction}
                            >
                                <PencilOff size={16} />
                            </button>
                        {:else}
                            <span
                                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <button
                                    class="cursor-pointer hover:text-primary hover:drop-shadow-lg hover:drop-shadow-primary"
                                    title="Cancel Edit"
                                    onclick={() => handleEditAction(action)}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    class="cursor-pointer text-error hover:text-error hover:drop-shadow-lg hover:drop-shadow-error"
                                    title="Delete"
                                    onclick={() =>
                                        handleDeleteAction(action.id)}
                                >
                                    <Trash size={16} />
                                </button>
                            </span>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<div class="flex justify-center items-center p-2 border-t border-t-base-100">
    <button
        class="btn btn-sm btn-soft btn-primary btn-wide rounded-full"
        onclick={handleSaveSite}
    >
        <span class="text-primary-content">Save</span>
    </button>
</div>
