<script lang="ts">
  import wxtLogo from "@/assets/wxt.svg";
  import { ChevronDown, Plus, Settings } from "@lucide/svelte";
</script>

<main class="flex flex-col h-screen">
  <header class="flex justify-between items-center py-1 px-2">
    <div class="flex items-center gap-2">
      <img src={wxtLogo} alt="Terminate Distraction Logo" class="w-6" />
      <h1 class="text-lg font-bold">Terminate Distraction</h1>
    </div>
    <button class="cursor-pointer">
      <Settings size={20} />
    </button>
  </header>

  <div class="flex flex-col flex-1 text-sm">
    <section class="flex flex-col flex-1">
      <div
        class="flex justify-between w-full items-center p-2 cursor-pointer"
      >
        <h2>Enabled Group</h2>
        <ChevronDown size={20} class="transition-transform" />
      </div>
      <div class="flex-1 bg-base-200"></div>
    </section>

    <section class="flex flex-col flex-1">
      <div
        class="flex justify-between w-full items-center p-2 cursor-pointer"
      >
        <h2>Disabled Group</h2>
        <ChevronDown size={20} class="transition-transform" />
      </div>
      <div class="flex-1 bg-base-200"></div>
    </section>
  </div>

  <div class="flex justify-center items-center w-full p-2 bottom-0 bg-base-200">
    <button class="btn btn-sm btn-soft btn-primary btn-wide">
      Add Site Group
    </button>
  </div>
</main>
