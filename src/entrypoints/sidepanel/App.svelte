<script lang="ts">
  import wxtLogo from "@/assets/wxt.svg";
  import {
    ChevronDown,
    LockOpen,
    Pencil,
    Plus,
    Settings,
    Settings2,
    SquarePen,
  } from "@lucide/svelte";
</script>

<main class="flex flex-col bg-base-300 h-screen">
  <header
    class="flex justify-between items-center p-2 border-b border-b-base-100"
  >
    <div class="flex items-center gap-2">
      <img src={wxtLogo} alt="Terminate Distraction Logo" class="w-6" />
      <h1 class="text-lg font-bold">Terminate Distraction</h1>
    </div>
    <button class="cursor-pointer">
      <Settings size={20} />
    </button>
  </header>

  <div class="flex flex-col flex-1 gap-2 p-2 min-h-0 overflow-y-auto topography-pattern scrollbar-hidden">
    {#each { length: 12 }}
      <div class="flex flex-col gap-2 bg-base-100 shadow rounded-xl p-2">
        <div class="flex flex-1 gap-2 items-center text-sm">
          <span class="flex flex-1 gap-2 min-w-0">
            <span class="font-semibold text-green-600">0/6</span>
            <span class="truncate flex-1">Youtube Distraction</span>
          </span>
          <button class="btn btn-xs btn-soft rounded-full hover:btn-primary w-16">
            Unlock
          </button>
        </div>
        <span class="border-t border-base-content/10"></span>
        <div class="flex flex-1 justify-between items-center text-xs">
          <span class="flex gap-1">
            <span class="font-bold">Status:</span>
            <span>Active</span>
          </span>
          <span class="flex gap-2 items-center">
            <span class="text-base-content/35">0 days streak</span>
            <button class="btn btn-xs btn-soft hover:btn-primary btn-circle">
              <Pencil size={12} />
            </button>
          </span>
        </div>
      </div>
    {/each}
  </div>

  <div
    class="flex justify-center items-center p-2 border-t border-t-base-100"
  >
    <button class="btn btn-sm btn-soft btn-primary btn-wide rounded-full">
      <span class="text-primary-content">Add Site Group</span>
    </button>
  </div>
</main>
