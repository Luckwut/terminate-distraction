<script lang="ts">
    import wxtLogo from "@/assets/wxt.svg";
    import { Settings } from "@lucide/svelte";
</script>

<header class="flex justify-between items-center py-1 px-2">
    <div class="flex items-center gap-2">
        <img src={wxtLogo} alt="Terminate Distraction Logo" class="w-6" />
        <h1 class="text-lg font-bold">Terminate Distraction</h1>
    </div>
    <a class="cursor-pointer" href="OPTION_PAGE">
        <Settings size={20} />
    </a>
</header>
