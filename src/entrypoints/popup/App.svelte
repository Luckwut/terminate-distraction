<script lang="ts">
  import Header from "@/lib/popup/components/Header.svelte";
  import { type Page, setNavigationContext } from "@/lib/popup/navigationContext";
  import Home from "@/lib/popup/pages/Home.svelte";
  import RuleForm from "@/lib/popup/pages/RuleForm.svelte";
    import { setSelectedRuleContext } from "@/lib/popup/selectedRuleContext";

  let currentPage = $state<Page>("home");
  const navigate = (page: Page) => (currentPage = page);
  setNavigationContext(navigate);

  let selectedRule = $state<{ id: string | null }>({ id: null });
  setSelectedRuleContext(selectedRule);
</script>

<main class="w-96 flex flex-col text-sm">
  <Header />

  {#if currentPage === "home"}
    <Home />
  {:else}
    <RuleForm />
  {/if}
</main>
