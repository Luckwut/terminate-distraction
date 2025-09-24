<script lang="ts">
  import { ArrowLeft, ChevronUp, CircleQuestionMark } from '@lucide/svelte';
  import { router } from '@/lib/sidepanel/router.svelte';
  import { rulesStore } from '@/lib/data/rules/store.svelte';
  import { ruleFormStore } from '@/lib/sidepanel/ruleFormStore.svelte';
  import type { Rule, Site } from '@/lib/data/rules/types';
  import { slide } from 'svelte/transition';
  import { sendMessage } from '@/lib/messaging';
  import { normalizeUrl, removeProtocol } from '@/lib/helpers/url';

  interface Props {
    id?: string | null;
  }

  let { id = null }: Props = $props();

  onMount(async () => {
    await rulesStore.load();

    if (id !== null) {
      if (ruleFormStore.currentRule.id !== id) {
        const ruleToEdit = rulesStore.rules.find((r) => r.id === id);
        if (ruleToEdit) {
          ruleFormStore.setRule(ruleToEdit);
        } else {
          router.pop();
        }
      }
    }
  });

  let siteUrlInput = $state('');
  let isSiteUrlInvalid = $state(false);
  let siteUrlInvalidMessage = $state('');

  let isRuleNameEmpty = $state(false);

  let isAdditionalOptionsOpen = $state(true);
  const advancedOptionChevronClass = $derived(
    isAdditionalOptionsOpen ? '' : '-rotate-180'
  );

  const isEditMode = $derived(id !== null);

  async function getCurrentSiteUrl(): Promise<string> {
    try {
      return await sendMessage('getCurrentSiteUrl');
    } catch (error) {
      console.error('Failed to get current URL:', error);
      return '';
    }
  }

  async function fetchUrl() {
    const rawUrl = await getCurrentSiteUrl();
    const url = removeProtocol(rawUrl);
    siteUrlInput = url.endsWith('/') ? url.slice(0, -1) : url;
  }

  function navigateToHome() {
    ruleFormStore.reset();
    router.pop();
  }

  function navigateToSiteActionForm(siteId: string) {
    router.push({
      name: 'siteActionsForm',
      params: { id: siteId },
    });
  }

  function hasBlockPage(site: Site) {
    return site.actions.some((action) => action.type === 'BLOCK_PAGE');
  }

  function countHiddenElementAction(site: Site) {
    return site.actions.filter((action) => action.type === 'HIDE_ELEMENT')
      .length;
  }

  function handleUrlInvalid(errorMessage: string) {
    isSiteUrlInvalid = true;
    siteUrlInvalidMessage = errorMessage;
  }

  function handleAddSite() {
    try {
      const url = normalizeUrl(removeProtocol(siteUrlInput));

      ruleFormStore.currentRule.sites.push({
        id: crypto.randomUUID(),
        siteUrl: url,
        actions: [],
      });
      siteUrlInput = '';
    } catch (error) {
      if (error instanceof Error) {
        handleUrlInvalid(error.message);
      } else {
        handleUrlInvalid('An unexpected error occurred.');
      }
    }
  }

  function handleDelete() {
    const rules = rulesStore.rules;
    const updatedRules = rules.filter((r) => r.id !== id);
    rulesStore.update(updatedRules);
    navigateToHome();
  }

  function handleSave(rule: Rule) {
    const rules = rulesStore.rules;

    if (!rule.name.trim()) {
      isRuleNameEmpty = true;
      return;
    }
    rule.name = rule.name.trim();

    for (const key in rule.option) {
      const optionKey = key as keyof Rule['option'];
      rule.option[optionKey] = Number(rule.option[optionKey]) || 0;
    }

    const updatedRules = isEditMode
      ? rules.map((r) => (r.id === id ? rule : r))
      : [...rules, rule];

    rulesStore.update(updatedRules);
    navigateToHome();
  }
</script>

<header class="border-b-base-100 flex items-center border-b px-3 py-2">
  <div class="flex items-center gap-2">
    <button class="cursor-pointer" onclick={navigateToHome}>
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-lg">
      {isEditMode ? 'Add New Rule' : 'Edit Rule'}
    </h1>
  </div>
</header>

<section
  class="topography-pattern scrollbar-hidden flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto p-2">
  <div
    class="bg-base-100 flex w-full max-w-lg flex-col gap-2 rounded-lg p-3 shadow">
    <h1 class="text-lg">General</h1>

    <div class="flex flex-col gap-3">
      <div class="flex flex-col">
        <div class="relative flex items-center justify-between">
          <span>Rule Name</span>
          <input
            type="text"
            class="input input-sm w-52 {isRuleNameEmpty ? 'input-error' : ''}"
            oninput={() => {
              isRuleNameEmpty = false;
            }}
            bind:value={ruleFormStore.currentRule.name} />
        </div>
        {#if isRuleNameEmpty}
          <span class="text-error mt-1 text-end" transition:slide>
            This field cannot be left empty
          </span>
        {/if}
      </div>

      <div class="flex items-center justify-between">
        <span>Rule Enabled</span>
        <div class="flex items-center gap-2">
          <span class="text-base-content/35 text-xs">
            {ruleFormStore.currentRule.enabled ? 'Active' : 'Disabled'}
          </span>
          <input
            type="checkbox"
            class="toggle toggle-primary toggle-sm checked:bg-primary checked:text-primary-content"
            bind:checked={ruleFormStore.currentRule.enabled} />
        </div>
      </div>

      {#if isEditMode}
        <div class="flex items-center justify-between">
          <span>Delete Rule</span>
          <button
            class="btn btn-error btn-soft btn-xs rounded-xl px-4"
            onclick={handleDelete}>
            Delete
          </button>
        </div>
      {/if}
    </div>
  </div>

  <section
    class="bg-base-100 flex w-full max-w-lg flex-col gap-2 rounded-lg p-3 shadow">
    <div
      role="button"
      tabindex="0"
      class="flex cursor-pointer justify-between"
      onclick={() => (isAdditionalOptionsOpen = !isAdditionalOptionsOpen)}
      onkeydown={(e) =>
        (e.key === 'Enter' || e.key === ' ') &&
        (isAdditionalOptionsOpen = !isAdditionalOptionsOpen)}>
      <h1 class="text-lg">Additional Options</h1>
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-35">Optional</span>
        <ChevronUp
          size={20}
          class="transition-transform {advancedOptionChevronClass}" />
      </div>
    </div>

    {#if isAdditionalOptionsOpen}
      <div class="flex flex-col gap-2" transition:slide>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Daily limit</span>
            <CircleQuestionMark
              size={12}
              class="hover:text-primary cursor-pointer text-gray-600 transition" />
          </div>
          <div class="mr-2 flex items-center">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={ruleFormStore.currentRule.option.dailyLimit} />
            <span class="inline-block w-12 text-right">unlock</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Unlock Duration</span>
            <CircleQuestionMark
              size={12}
              class="hover:text-primary cursor-pointer text-gray-600 transition" />
          </div>
          <div class="mr-2 flex items-center">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={
                ruleFormStore.currentRule.option.unlockDurationMinute
              } />
            <span class="inline-block w-12 text-right">minute</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Cooldown between unlock</span>
            <CircleQuestionMark
              size={12}
              class="hover:text-primary cursor-pointer text-gray-600 transition" />
          </div>
          <div class="mr-2 flex items-center">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={ruleFormStore.currentRule.option.cooldownMinute} />
            <span class="inline-block w-12 text-right">minute</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Pause before unlock</span>
            <CircleQuestionMark
              size={12}
              class="hover:text-primary cursor-pointer text-gray-600 transition" />
          </div>
          <div class="mr-2 flex items-center">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={
                ruleFormStore.currentRule.option.pauseBeforeUnlockSecond
              } />
            <span class="inline-block w-12 text-right">second</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Increase pause time per unlock</span>
            <CircleQuestionMark
              size={12}
              class="hover:text-primary cursor-pointer text-gray-600 transition" />
          </div>
          <div class="mr-2 flex items-center">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={
                ruleFormStore.currentRule.option.increasePausePerUnlockSecond
              } />
            <span class="inline-block w-12 text-right">second</span>
          </div>
        </div>
      </div>
    {/if}
  </section>

  <section
    class="bg-base-100 flex w-full max-w-lg flex-col gap-2 rounded-lg p-3 shadow">
    <span class="flex items-center gap-2">
      <h1 class="text-lg">Sites</h1>
      <CircleQuestionMark
        size={12}
        class="hover:text-primary cursor-pointer text-gray-600 transition" />
    </span>

    <div class="flex flex-col">
      <label
        class="input input-sm w-full {isSiteUrlInvalid ? 'input-error' : ''}">
        <span>https://</span>
        <input
          type="text"
          class="grow"
          placeholder="www.youtube.com/shorts/*"
          oninput={() => {
            isSiteUrlInvalid = false;
          }}
          bind:value={siteUrlInput} />
      </label>
      {#if isSiteUrlInvalid}
        <span class="text-error mt-1" transition:slide>
          {siteUrlInvalidMessage}
        </span>
      {/if}
      <div class="mt-2 flex gap-2">
        <button
          class="btn btn-secondary btn-soft btn-sm flex-1 rounded-lg"
          onclick={fetchUrl}>
          Current URL
        </button>
        <button
          class="btn btn-primary btn-soft btn-sm flex-1 rounded-lg"
          onclick={handleAddSite}>
          Add
        </button>
      </div>
    </div>

    {#if ruleFormStore.currentRule.sites.length !== 0}
      {#snippet noActions()}
        <span class="badge badge-xs badge-soft badge-warning">No Action</span>
      {/snippet}

      {#snippet blockedSiteIndicator()}
        <span class="badge badge-xs badge-soft badge-error">Blocked</span>
      {/snippet}

      {#snippet hiddenElementIndicator(amount: number)}
        <span class="badge badge-xs badge-soft">{amount} Hidden</span>
      {/snippet}

      <div class="bg-base-200 flex flex-col gap-2 rounded p-3 text-xs">
        {#each ruleFormStore.currentRule.sites as site (site.id)}
          <div class="flex items-center gap-2">
            <button
              class="link link-primary flex-1 text-start font-mono break-all"
              onclick={() => navigateToSiteActionForm(site.id)}>
              {site.siteUrl}
            </button>
            {#if site.actions.length === 0}
              {@render noActions()}
            {:else if hasBlockPage(site)}
              {@render blockedSiteIndicator()}
            {:else}
              {@render hiddenElementIndicator(countHiddenElementAction(site))}
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>
</section>

<div class="border-t-base-100 flex items-center justify-center border-t p-2">
  <button
    class="btn btn-sm btn-soft btn-primary btn-wide rounded-full"
    onclick={() => handleSave(ruleFormStore.currentRule)}>
    <span class="text-primary-content">Save</span>
  </button>
</div>
