<script lang="ts">
  import { ArrowLeft, ChevronUp, CircleQuestionMark } from "@lucide/svelte";
  import { router } from "@/lib/sidepanel/router.svelte";
  import { rulesStore } from "@/lib/data/rules/store.svelte";
  import { ruleFormStore } from "@/lib/sidepanel/ruleFormStore.svelte";
  import type { Rule, Site } from "@/lib/data/rules/types";
  import { blur, slide } from "svelte/transition";
  import { sendMessage } from "@/lib/messaging";

  interface Props {
    id?: string | null;
  }

  let { id = null }: Props = $props();

  onMount(async () => {
    if (id === null) {
      ruleFormStore.reset();
      return;
    }

    await rulesStore.load();

    if (ruleFormStore.currentRule.id !== id) {
      const ruleToEdit = rulesStore.rules.find((r) => r.id === id);
      if (ruleToEdit) {
        ruleFormStore.setRule(ruleToEdit);
      } else {
        router.pop();
      }
    }
  });

  let siteUrlInputRef: HTMLInputElement | null;
  let isSiteUrlInvalid = $state(false);
  let urlInvalidTimeout: ReturnType<typeof setTimeout> | null = $state(null);

  let ruleNameInputRef: HTMLInputElement | null;
  let siteUrlInput = $state("");

  let isAdditionalOptionsOpen = $state(true);
  const advancedOptionChevronClass = $derived(
    isAdditionalOptionsOpen ? "" : "-rotate-180",
  );

  const isEditMode = $derived(id !== null);

  function removeProtocol(url: string) {
    return url.replace(/^https?:\/\//, "");
  }

  async function getCurrentSiteUrl(): Promise<string> {
    try {
      return await sendMessage("getCurrentSiteUrl");
    } catch (error) {
      console.error("Failed to get current URL:", error);
      return "";
    }
  }

  async function fetchUrl() {
    const rawUrl = await getCurrentSiteUrl();
    const url = removeProtocol(rawUrl);
    siteUrlInput = url.endsWith("/") ? url.slice(0, -1) : url;
  }

  function navigateToHome() {
    ruleFormStore.reset();
    router.pop();
  }

  function navigateToSiteActionForm(siteId: string) {
    router.push({
      name: "siteActionsForm",
      params: { id: siteId },
    });
  }

  function hasBlockPage(site: Site) {
    return site.actions.some((action) => action.type === "BLOCK_PAGE");
  }

  function countHiddenElementAction(site: Site) {
    return site.actions.filter((action) => action.type === "HIDE_ELEMENT")
      .length;
  }

  function checkUrlValidity(siteUrl: string) {
    const url = siteUrl.trim();

    if (!url) return false;
    if (/\s/.test(url)) return false;

    const pattern = /^(\*\.)?([\w-]+\.)+[a-zA-Z]{2,}(\/[\w.*-]*)*$/;

    return pattern.test(url);
  }

  function handleUrlInvalid() {
    if (urlInvalidTimeout) {
      clearTimeout(urlInvalidTimeout);
    }

    siteUrlInputRef?.classList.add("input-error");
    isSiteUrlInvalid = true;

    urlInvalidTimeout = setTimeout(() => {
      siteUrlInputRef?.classList.remove("input-error");
      isSiteUrlInvalid = false;
      urlInvalidTimeout = null;
    }, 1000);
  }

  function handleAddSite() {
    const url = removeProtocol(siteUrlInput);

    if (!checkUrlValidity(url)) {
      handleUrlInvalid();
      return;
    }

    ruleFormStore.currentRule.sites.push({
      id: crypto.randomUUID(),
      siteUrl: url,
      actions: [],
    });
    siteUrlInput = "";
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
      ruleNameInputRef!.placeholder = "Name cannot be empty!";
      ruleNameInputRef!.classList.add("input-error");
      return;
    }
    rule.name = rule.name.trim();

    for (const key in rule.option) {
      const optionKey = key as keyof Rule["option"];
      rule.option[optionKey] = Number(rule.option[optionKey]) || 0;
    }

    const updatedRules = isEditMode
      ? rules.map((r) => (r.id === id ? rule : r))
      : [...rules, rule];

    rulesStore.update(updatedRules);
    navigateToHome();
  }
</script>

<header class="flex items-center py-2 px-3 border-b border-b-base-100">
  <div class="flex items-center gap-2">
    <button class="cursor-pointer" onclick={navigateToHome}>
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-lg">
      {isEditMode ? "Add New Rule" : "Edit Rule"}
    </h1>
  </div>
</header>

<section
  class="flex flex-col flex-1 items-center gap-2 p-2 min-h-0 overflow-y-auto topography-pattern scrollbar-hidden"
>
  <div
    class="flex flex-col gap-2 bg-base-100 shadow rounded-lg p-3 max-w-lg w-full"
  >
    <h1 class="text-lg">General</h1>

    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span>Rule Name</span>
        <input
          type="text"
          class="input input-sm w-52"
          bind:value={ruleFormStore.currentRule.name}
          bind:this={ruleNameInputRef}
        />
      </div>

      <div class="flex items-center justify-between">
        <span>Rule Enabled</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-base-content/35">Disabled</span>
          <input
            type="checkbox"
            class="toggle toggle-primary toggle-sm checked:bg-primary checked:text-primary-content"
            bind:checked={ruleFormStore.currentRule.enabled}
          />
        </div>
      </div>

      {#if isEditMode}
        <div class="flex items-center justify-between">
          <span>Delete Rule</span>
          <button
            class="btn btn-error btn-soft btn-xs px-4 rounded-xl"
            onclick={handleDelete}
          >
            Delete
          </button>
        </div>
      {/if}
    </div>
  </div>

  <section
    class="flex flex-col gap-2 bg-base-100 shadow rounded-lg p-3 max-w-lg w-full"
  >
    <div
      role="button"
      tabindex="0"
      class="flex justify-between cursor-pointer"
      onclick={() => (isAdditionalOptionsOpen = !isAdditionalOptionsOpen)}
      onkeydown={(e) =>
        (e.key === "Enter" || e.key === " ") &&
        (isAdditionalOptionsOpen = !isAdditionalOptionsOpen)}
    >
      <h1 class="text-lg">Additional Options</h1>
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-35">Optional</span>
        <ChevronUp
          size={20}
          class="transition-transform {advancedOptionChevronClass}"
        />
      </div>
    </div>

    {#if isAdditionalOptionsOpen}
      <div class="flex flex-col gap-2" transition:slide>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Daily limit</span>
            <CircleQuestionMark
              size={12}
              class="text-gray-600 hover:text-primary transition cursor-pointer"
            />
          </div>
          <div class="flex items-center mr-2">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={ruleFormStore.currentRule.option.dailyLimit}
            />
            <span class="inline-block w-12 text-right">unlock</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Unlock Duration</span>
            <CircleQuestionMark
              size={12}
              class="text-gray-600 hover:text-primary transition cursor-pointer"
            />
          </div>
          <div class="flex items-center mr-2">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={ruleFormStore.currentRule.option.unlockDurationMinute}
            />
            <span class="inline-block w-12 text-right">minute</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Cooldown between unlock</span>
            <CircleQuestionMark
              size={12}
              class="text-gray-600 hover:text-primary transition cursor-pointer"
            />
          </div>
          <div class="flex items-center mr-2">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={ruleFormStore.currentRule.option.cooldownMinute}
            />
            <span class="inline-block w-12 text-right">minute</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Pause before unlock</span>
            <CircleQuestionMark
              size={12}
              class="text-gray-600 hover:text-primary transition cursor-pointer"
            />
          </div>
          <div class="flex items-center mr-2">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={
                ruleFormStore.currentRule.option.pauseBeforeUnlockSecond
              }
            />
            <span class="inline-block w-12 text-right">second</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span>Increase pause time per unlock</span>
            <CircleQuestionMark
              size={12}
              class="text-gray-600 hover:text-primary transition cursor-pointer"
            />
          </div>
          <div class="flex items-center mr-2">
            <input
              type="number"
              class="input input-xs w-16"
              min="0"
              bind:value={
                ruleFormStore.currentRule.option.increasePausePerUnlockSecond
              }
            />
            <span class="inline-block w-12 text-right">second</span>
          </div>
        </div>
      </div>
    {/if}
  </section>

  <section
    class="flex flex-col gap-2 bg-base-100 shadow rounded-lg p-3 max-w-lg w-full"
  >
    <span class="flex items-center gap-2">
      <h1 class="text-lg">Sites</h1>
      <CircleQuestionMark
        size={12}
        class="text-gray-600 hover:text-primary transition cursor-pointer"
      />
    </span>

    <div class="flex flex-col gap-2">
      <label class="input input-sm w-full">
        <span>https://</span>
        <input
          type="text"
          class="grow"
          placeholder="www.youtube.com/shorts/*"
          bind:value={siteUrlInput}
          bind:this={siteUrlInputRef}
        />
      </label>
      <div class="flex gap-2">
        <button
          class="flex-1 btn btn-secondary btn-soft btn-sm rounded-lg"
          onclick={fetchUrl}
        >
          Current URL
        </button>
        <div class="relative flex-1 overflow-hidden">
          {#key isSiteUrlInvalid}
            <div class="absolute inset-0 flex" transition:blur>
              {#if isSiteUrlInvalid}
                <button
                  class="flex-1 btn btn-error btn-soft btn-sm rounded-lg"
                  onclick={handleAddSite}
                >
                  Invalid URL format
                </button>
              {:else}
                <button
                  class="flex-1 btn btn-primary btn-soft btn-sm rounded-lg"
                  onclick={handleAddSite}
                >
                  Add
                </button>
              {/if}
            </div>
          {/key}
        </div>
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

      <div class="flex flex-col gap-2 p-3 bg-base-200 rounded text-xs">
        {#each ruleFormStore.currentRule.sites as site (site.id)}
          <div class="flex items-center gap-2">
            <button
              class="flex-1 font-mono link link-primary text-start break-all"
              onclick={() => navigateToSiteActionForm(site.id)}
            >
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

<div class="flex justify-center items-center p-2 border-t border-t-base-100">
  <button
    class="btn btn-sm btn-soft btn-primary btn-wide rounded-full"
    onclick={() => handleSave(ruleFormStore.currentRule)}
  >
    <span class="text-primary-content">Save</span>
  </button>
</div>
