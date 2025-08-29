<script lang="ts">
    import type { Action } from "@/lib/types";
    import {
        ChevronDown,
        Ellipsis,
        PencilLine,
        Trash2,
    } from "@lucide/svelte";

    interface Props {
        siteUrl: string;
        actions: Array<Action>;
    }

    let { siteUrl, actions }: Props = $props();

    let isDropdownCollapsed = $state(false);
    const chevronClass = $derived(isDropdownCollapsed ? "" : "rotate-180");

    let dialogElement: HTMLDialogElement | undefined;
    $effect(() => {
        // dialogElement?.showModal();
    });
</script>

<section>
    <div
        role="button"
        tabindex="0"
        class="flex justify-between items-center bg-base-300 w-full p-2 cursor-pointer"
        onclick={() => (isDropdownCollapsed = !isDropdownCollapsed)}
        onkeydown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            (isDropdownCollapsed = !isDropdownCollapsed)}
    >
        <span class="font-mono">{siteUrl}</span>

        <div class="flex items-center gap-2">
            <div class="dropdown dropdown-hover dropdown-top dropdown-end">
                <div
                    tabindex="0"
                    role="button"
                    class="hover:text-gray-400"
                    title="Options"
                >
                    <Ellipsis size={20} />
                </div>
                <ul
                    class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                    <li>
                        <button>Hide Element</button>
                    </li>
                    <li>
                        <button>Block Site</button>
                    </li>
                    <li>
                        <button class="text-error">Delete</button>
                    </li>
                </ul>
            </div>

            <ChevronDown
                size={20}
                class="transition-transform {chevronClass}"
            />
        </div>
    </div>

    {#if !isDropdownCollapsed}
        {#each actions as action (action.id)}
            <div
                class="flex items-center justify-between bg-base-300 pb-2 pt-1 px-3"
            >
                <span>{action.label}</span>
                <div class="flex items-center gap-3">
                    <span class="text-xs opacity-35">{action.type}</span>
                    <button class="cursor-pointer" title="Delete">
                        <Trash2 class="text-red-500 hover:text-red-800" size={16} />
                    </button>
                    <button class="cursor-pointer" title="Edit">
                        <PencilLine class="hover:text-gray-400" size={16} />
                    </button>
                </div>
            </div>
        {/each}
    {/if}

    <!-- Delete Modal -->
    <dialog class="modal" bind:this={dialogElement}>
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
    </dialog>
</section>
