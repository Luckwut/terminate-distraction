<script lang="ts">
  import {
    ArrowLeft,
    MousePointerClick,
    Pencil,
    PencilOff,
    Trash,
  } from '@lucide/svelte';
  import { router } from '@/lib/sidepanel/router.svelte';
  import type { HideElementAction, Site } from '@/lib/data/rules/types';
  import { ruleFormStore } from '@/lib/sidepanel/ruleFormStore.svelte';
  import { slide } from 'svelte/transition';
  import { onMessage, sendMessage } from '@/lib/messaging';
  import { normalizeUrl, removeProtocol } from '@/lib/helpers/url';
  import QuestionMarkInfo from '@/lib/sidepanel/components/QuestionMarkInfo.svelte';

  interface Props {
    id: string;
  }

  let { id }: Props = $props();

  function getSiteData() {
    const snapshotRule = $state.snapshot(ruleFormStore.currentRule);
    return snapshotRule.sites.find((r) => r.id === id)!;
  }

  function hasBlockPage(site: Site) {
    return site.actions.some((action) => action.type === 'BLOCK_PAGE');
  }

  let site = $state<Site>(getSiteData());
  let blockedToggle = $state(hasBlockPage(site));
  let hideElementInput = $state({
    id: '',
    label: '',
    selector: '',
  });
  let trackErrorInputs = $state({
    siteUrl: false,
    label: false,
    selector: false,
  });
  let siteUrlInvalidMessage = $state('');
  let isSelectorMode = $state(false);
  let currentUrl = $state('');
  let showWarning = $state(false);
  const rawSiteUrl = $state.snapshot(site.siteUrl);
  let currentTabId = $state<number | undefined>(undefined);

  onMount(async () => {
    currentTabId = await sendMessage('getCurrentTabId');
    currentUrl = await sendMessage('getCurrentSiteUrl');
    const pattern = new MatchPattern(`*://${site.siteUrl}`);
    showWarning = !pattern.includes(currentUrl) && !currentUrl.endsWith('*');
  });

  onDestroy(async () => {
    await sendMessage('disableSelectorMode', undefined, currentTabId);
  });

  $effect(() => {
    const removeListener = onMessage('selectElementSelector', (message) => {
      hideElementInput.selector = message.data;
      isSelectorMode = false;
      sendMessage('disableSelectorMode', undefined, currentTabId);
    });

    return removeListener;
  });

  async function toggleSelectorMode() {
    isSelectorMode = !isSelectorMode;
    if (isSelectorMode) {
      await sendMessage('enableSelectorMode', undefined, currentTabId);
    } else {
      await sendMessage('disableSelectorMode', undefined, currentTabId);
    }
  }

  function handleUrlInvalid(errorMessage: string) {
    trackErrorInputs.siteUrl = true;
    siteUrlInvalidMessage = errorMessage;
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
    hideElementInput.id = '';
    hideElementInput.label = '';
    hideElementInput.selector = '';
  }

  function handleSaveAction() {
    if (hideElementInput.label.trim() === '') trackErrorInputs.label = true;
    if (hideElementInput.selector.trim() === '')
      trackErrorInputs.selector = true;

    if (
      hideElementInput.label.trim() === '' ||
      hideElementInput.selector.trim() === ''
    ) {
      return;
    }

    const hideElement: HideElementAction = {
      id: hideElementInput.id ? hideElementInput.id : crypto.randomUUID(),
      type: 'HIDE_ELEMENT',
      label: hideElementInput.label,
      selector: hideElementInput.selector,
    };

    const actionExists = site.actions.some((a) => a.id === hideElementInput.id);

    if (actionExists) {
      site.actions = site.actions.map((a) =>
        a.id === hideElementInput.id ? { ...hideElement } : a
      );
    } else {
      site.actions.push(hideElement);
    }

    hideElementInput.id = '';
    hideElementInput.label = '';
    hideElementInput.selector = '';
  }

  function handleRemoveSite() {
    const updatedSites = ruleFormStore.currentRule.sites.filter(
      (s) => s.id !== id
    );
    ruleFormStore.currentRule.sites = updatedSites;
    navigateToRuleForm();
  }

  function handleSaveSite() {
    if (site.siteUrl.trim() === '') {
      trackErrorInputs.siteUrl = true;
      return;
    }

    try {
      const url = normalizeUrl(removeProtocol(site.siteUrl));
      site.siteUrl = url;

      if (blockedToggle && !hasBlockPage(site)) {
        site.actions.push({
          id: crypto.randomUUID(),
          type: 'BLOCK_PAGE',
        });
      } else {
        site.actions = site.actions.filter((a) => a.type !== 'BLOCK_PAGE');
      }

      ruleFormStore.currentRule.sites = ruleFormStore.currentRule.sites.map(
        (s) => (s.id === site.id ? { ...site } : s)
      );
      navigateToRuleForm();
    } catch (error) {
      if (error instanceof Error) {
        handleUrlInvalid(error.message);
      } else {
        handleUrlInvalid('An unexpected error occurred.');
      }
    }
  }
</script>

<header class="border-b-base-100 flex items-center border-b px-3 py-2">
  <div class="flex items-center gap-2">
    <button class="cursor-pointer" onclick={navigateToRuleForm}>
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-lg">Site Actions</h1>
  </div>
</header>

<div
  class="topography-pattern scrollbar-hidden flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto p-2">
  <div
    class="bg-base-100 flex w-full max-w-lg flex-col gap-2 rounded-lg p-3 shadow">
    <h1 class="text-lg">Configure</h1>

    <div class="flex flex-col gap-2">
      <div class="mb-2 flex flex-col gap-1">
        <span>Site URL</span>
        <label
          class="input input-sm w-full {trackErrorInputs.siteUrl
            ? 'input-error'
            : ''}">
          <span>https://</span>
          <input
            type="text"
            class="grow"
            placeholder="www.youtube.com/shorts/*"
            oninput={() => {
              trackErrorInputs.siteUrl = false;
            }}
            bind:value={site.siteUrl} />
        </label>
        {#if trackErrorInputs.siteUrl}
          <span class="text-error text-xs" transition:slide>
            {siteUrlInvalidMessage.trim() === ''
              ? 'This field cannot be left empty'
              : siteUrlInvalidMessage}
          </span>
        {/if}
        {#if showWarning}
          <span class="text-warning text-xs break-words" transition:slide>
            Warning: Current page {currentUrl} does not match the site pattern {rawSiteUrl}.
            Selectors may not apply.
          </span>
        {/if}
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <span>Block Site</span>
          <QuestionMarkInfo>
            <div class="h-48">
              <img
                class="h-full w-full object-contain"
                src="https://projectwingman.wiki.gg/images/thumb/Federation.png/600px-Federation.png"
                alt="Guide about URL pattern" />
            </div>
            <div class="mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              deserunt harum error vero itaque maxime maiores, beatae neque ab
              doloribus perspiciatis perferendis quo necessitatibus laudantium
              ullam asperiores modi eos qui!
            </div>
          </QuestionMarkInfo>
        </div>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm checked:bg-primary checked:text-primary-content"
          title="Block this site"
          bind:checked={blockedToggle} />
      </div>

      <div class="flex items-center justify-between">
        <span>Remove Site</span>
        <button
          class="btn btn-error btn-soft btn-xs rounded-xl px-4"
          title="Remove this site"
          onclick={handleRemoveSite}>
          Remove
        </button>
      </div>
    </div>
  </div>

  {#if !blockedToggle}
    <div
      class="bg-base-100 flex w-full max-w-lg flex-col gap-2 rounded-lg p-3 shadow"
      transition:slide>
      <span class="flex items-center gap-2">
        <h1 class="text-lg">Hide Element</h1>
        <QuestionMarkInfo>
          <div class="h-48">
            <img
              class="h-full w-full object-contain"
              src="https://projectwingman.wiki.gg/images/thumb/Federation.png/600px-Federation.png"
              alt="Guide about URL pattern" />
          </div>
          <div class="mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            deserunt harum error vero itaque maxime maiores, beatae neque ab
            doloribus perspiciatis perferendis quo necessitatibus laudantium
            ullam asperiores modi eos qui!
          </div>
        </QuestionMarkInfo>
      </span>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1">
          <span>Label</span>
          <input
            type="text"
            class="input input-sm {trackErrorInputs.label ? 'input-error' : ''}"
            oninput={() => {
              trackErrorInputs.label = false;
            }}
            bind:value={hideElementInput.label} />
          {#if trackErrorInputs.label}
            <span class="text-error text-xs" transition:slide>
              This field cannot be left empty
            </span>
          {/if}
        </div>
        <div class="flex flex-col gap-1">
          <span>Selector</span>
          <textarea
            class="textarea textarea-xs min-h-16 font-mono {trackErrorInputs.selector
              ? 'textarea-error'
              : ''}"
            oninput={() => {
              trackErrorInputs.selector = false;
            }}
            bind:value={hideElementInput.selector}></textarea>
          {#if trackErrorInputs.selector}
            <span class="text-error text-xs" transition:slide>
              This field cannot be left empty
            </span>
          {/if}
        </div>
        <div class="flex gap-2">
          <button
            class="btn btn-primary btn-soft btn-sm flex-1 rounded-lg"
            title="Add element into the 'Hide Element' list"
            onclick={handleSaveAction}>
            {hideElementInput.id ? 'Update' : 'Add'}
          </button>
          <button
            class="btn btn-secondary {isSelectorMode
              ? ''
              : 'btn-soft'} btn-sm rounded-lg"
            title="Select an element from the current website"
            onclick={toggleSelectorMode}>
            <MousePointerClick size={20} />
          </button>
        </div>
      </div>

      {#if site.actions.some((a) => a.type === 'HIDE_ELEMENT')}
        <div class="bg-base-200 mt-2 flex flex-col rounded p-2 text-sm">
          {#each site.actions as action}
            {#if action.type === 'HIDE_ELEMENT'}
              <div
                class="group hover:bg-base-100 flex cursor-default items-center justify-between gap-2 rounded p-2">
                <span class="flex-1 break-all">
                  {action.label}
                </span>
                {#if hideElementInput.id === action.id}
                  <button
                    class="text-primary drop-shadow-primary cursor-pointer drop-shadow-lg"
                    title="Edit"
                    onclick={handleCancelEditAction}>
                    <PencilOff size={16} />
                  </button>
                {:else}
                  <span
                    class="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      class="hover:text-primary hover:drop-shadow-primary cursor-pointer hover:drop-shadow-lg"
                      title="Cancel Edit"
                      onclick={() => handleEditAction(action)}>
                      <Pencil size={16} />
                    </button>
                    <button
                      class="text-error hover:text-error hover:drop-shadow-error cursor-pointer hover:drop-shadow-lg"
                      title="Delete"
                      onclick={() => handleDeleteAction(action.id)}>
                      <Trash size={16} />
                    </button>
                  </span>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<div class="border-t-base-100 flex items-center justify-center border-t p-2">
  <button
    class="btn btn-sm btn-soft btn-primary btn-wide rounded-full"
    onclick={handleSaveSite}>
    <span class="text-primary-content">Save</span>
  </button>
</div>
