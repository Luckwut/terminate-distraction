<script lang="ts">
    import { ArrowLeft, ChevronDown } from "@lucide/svelte";
    import SiteActionItem from "@/lib/popup/components/SiteActionItem.svelte";
    import { getRouterContext } from "@/lib/popup/router";
    import type { Rule } from "@/lib/types";
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
                initialFormState = {
                    id: ruleToEdit.id,
                    name: ruleToEdit.name,
                    enabled: ruleToEdit.enabled,
                    option: ruleToEdit.option,
                    sites: ruleToEdit.sites,
                };
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

    const isEditMode = $derived(id !== null);

    let isGeneralCollapsed = $state(false);
    const generalChevronClass = $derived(
        isGeneralCollapsed ? "" : "rotate-180",
    );

    let isOptionCollapsed = $state(true);
    const optionChevronClass = $derived(isOptionCollapsed ? "" : "rotate-180");

    let isSiteCollapsed = $state(false);
    const siteChevronClass = $derived(isSiteCollapsed ? "" : "rotate-180");

    // let buttonSectionBgColor = $state<
    //     "bg-base-100" | "bg-base-200" | "bg-base-300"
    // >("bg-base-100");

    let buttonSectionBgColor = $derived.by(() => {
        if (!isSiteCollapsed && form?.sites.length !== 0) {
            return "bg-base-300"
        }

        return isSiteCollapsed ? "bg-base-100" : "bg-base-200";
    });

    function handleSubmit() {
        // TODO: Add new rule data into storage
        navigate("home");
    }

    function goToEditHomeForm(e: MouseEvent | KeyboardEvent) {
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
                        <input
                            type="number"
                            class="input input-xs w-16"
                            bind:value={form.option.dailyLimit}
                        />
                        <span class="inline-block w-14 text-right">unlock</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 py-1 px-3"
                >
                    <span>Unlock duration</span>
                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            bind:value={form.option.cooldownMinute}
                        />
                        <span class="inline-block w-14 text-right">minute</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 py-1 px-3"
                >
                    <span>Cooldown between unlock</span>
                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            bind:value={form.option.unlockDurationMinute}
                        />
                        <span class="inline-block w-14 text-right">minute</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 py-1 px-3"
                >
                    <span>Pause before unlock</span>
                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
                            bind:value={form.option.pauseBeforeUnlockSecond}
                        />
                        <span class="inline-block w-14 text-right">second</span>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between bg-base-200 pb-2 pt-1 px-3"
                >
                    <span>Increase pause time per unlock</span>
                    <div class="flex items-center mr-2">
                        <input
                            type="number"
                            class="input input-xs w-16"
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
            <span>Sites</span>

            <ChevronDown
                size={20}
                class="transition-transform {siteChevronClass}"
            />
        </div>

        {#if !isSiteCollapsed}
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

            {#if form.sites}
                {#each form.sites as site (site.id)}
                    <SiteActionItem
                        siteUrl={site.siteUrl}
                        actions={site.actions}
                    />
                {/each}
            {/if}
        {/if}
    </section>

    <div class="flex justify-center items-center w-full p-2 bg-base-100 {buttonSectionBgColor}">
        <button class="btn btn-sm btn-soft btn-primary btn-wide">Save</button>
    </div>
{:else}
    <div class="p-4 text-center">Loading form...</div>
{/if}
