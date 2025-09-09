<script lang="ts">
  import {
    ArrowLeft,
    ChevronDown,
    CircleQuestionMark,
    Lock,
  } from "@lucide/svelte";
  import { router } from "@/lib/sidepanel/router.svelte";

  interface Props {
    id?: string | null;
  }

  let { id = null }: Props = $props();

  const isEditMode = $derived(id !== null);

  function navigateToHome() {
    router.navigate("home");
  }

  function navigateToSiteActionForm() {
    router.navigate("siteActionsForm");
  }
</script>

<header class="flex items-center py-2 px-3 border-b border-b-base-100">
  <div class="flex items-center gap-2">
    <button class="cursor-pointer" onclick={navigateToHome}>
      <ArrowLeft size={20} />
    </button>
    <h1 class="text-lg">Add New Rule</h1>
  </div>
</header>

<div
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
          placeholder="Name cannot be empty!"
        />
      </div>

      <div class="flex items-center justify-between">
        <span>Rule Enabled</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-base-content/35">Disabled</span>
          <input
            type="checkbox"
            class="toggle toggle-primary toggle-sm checked:bg-primary checked:text-primary-content"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span>Delete Rule</span>
        <button class="btn btn-error btn-soft btn-xs px-4 rounded-xl">
          Delete
        </button>
      </div>
    </div>
  </div>

  <div
    class="flex flex-col gap-2 bg-base-100 shadow rounded-lg p-3 max-w-lg w-full"
  >
    <div class="flex justify-between">
      <h1 class="text-lg">Additional Options</h1>
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-35">Optional</span>
        <ChevronDown size={20} class="transition-transform" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <span>Daily limit</span>
          <CircleQuestionMark
            size={12}
            class="text-gray-600 hover:text-primary transition cursor-pointer"
          />
        </div>
        <div class="flex items-center mr-2">
          <input type="number" class="input input-xs w-16" min="0" />
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
          <input type="number" class="input input-xs w-16" min="0" />
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
          <input type="number" class="input input-xs w-16" min="0" />
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
          <input type="number" class="input input-xs w-16" min="0" />
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
          <input type="number" class="input input-xs w-16" min="0" />
          <span class="inline-block w-12 text-right">second</span>
        </div>
      </div>
    </div>
  </div>

  <div
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
        />
      </label>
      <div class="flex gap-2">
        <button class="flex-1 btn btn-secondary btn-soft btn-sm rounded-lg">Current URL</button>
        <button class="flex-1 btn btn-primary btn-soft btn-sm rounded-lg">Add</button>
      </div>
    </div>

    <div class="flex flex-col gap-2 p-3 bg-base-200 rounded text-xs">
      <div class="flex items-center gap-2">
        <button
          class="flex-1 font-mono link link-primary text-start break-all"
          onclick={navigateToSiteActionForm}
        >
          *.youtube.com/shorts/*
        </button>
        <span class="badge badge-xs badge-soft badge-error">
          <Lock size={8} />
        </span>
      </div>
      <div class="flex justify-between items-center gap-2">
        <span class="flex-1 font-mono link link-primary">
          www.youtube.com
        </span>
        <span class="badge badge-xs badge-soft">1</span>
      </div>
    </div>
  </div>
</div>

<div class="flex justify-center items-center p-2 border-t border-t-base-100">
  <button class="btn btn-sm btn-soft btn-primary btn-wide rounded-full">
    <span class="text-primary-content">Save</span>
  </button>
</div>
