<script lang="ts">
    import {
        ArrowLeft,
        CircleQuestionMark,
        MousePointerClick,
        Pencil,
        Trash,
    } from "@lucide/svelte";
    import { router } from "@/lib/sidepanel/router.svelte";
    import type { Site } from "@/lib/data/rules/types";
    import { ruleFormStore } from "../ruleFormStore.svelte";

    interface Props {
        id: string;
    }

    let { id }: Props = $props();

    $inspect(ruleFormStore.currentRule);

    function getSiteData() {
        const snapshotRule = $state.snapshot(ruleFormStore.currentRule);
        return snapshotRule.sites.find((r) => r.id === id)!;
    }

    let site = $state<Site>(getSiteData());

    function navigateToRuleForm() {
        router.pop();
    }

    function handleRemoveSite() {
        const updatedSites = ruleFormStore.currentRule.sites.filter(
            (s) => s.id !== id,
        );
        ruleFormStore.currentRule.sites = updatedSites;
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
                <label class="input input-sm w-full">
                    <span>https://</span>
                    <input
                        type="text"
                        class="grow"
                        placeholder="www.youtube.com/shorts/*"
                        bind:value={site.siteUrl}
                    />
                </label>
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
                <input type="text" class="input input-sm" />
            </div>
            <div class="flex flex-col gap-1">
                <span>Selector</span>
                <textarea class="textarea textarea-xs font-mono min-h-16"
                ></textarea>
            </div>
            <div class="flex gap-2">
                <button
                    class="flex-1 btn btn-primary btn-soft btn-sm rounded-lg"
                    title="Add element into the 'Hide Element' list"
                >
                    Add
                </button>
                <button
                    class="btn btn-secondary btn-soft btn-sm rounded-lg"
                    title="Select an element from the current website"
                >
                    <MousePointerClick size={20} />
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-2 p-3 bg-base-200 rounded text-sm mt-2">
            <div class="flex justify-between items-center gap-2 group">
                <span class="flex-1 break-all group-hover:drop-shadow-md"
                    >Youtube Reels</span
                >
                <span
                    class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        class="cursor-pointer hover:text-primary hover:drop-shadow-lg hover:drop-shadow-primary"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        class="cursor-pointer text-error hover:text-error hover:drop-shadow-lg hover:drop-shadow-error"
                        title="Delete"
                    >
                        <Trash size={16} />
                    </button>
                </span>
            </div>
        </div>
    </div>
</div>

<div class="flex justify-center items-center p-2 border-t border-t-base-100">
    <button class="btn btn-sm btn-soft btn-primary btn-wide rounded-full">
        <span class="text-primary-content">Save</span>
    </button>
</div>
