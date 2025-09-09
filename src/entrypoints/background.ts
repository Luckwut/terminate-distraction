import { initInitialData } from "@/lib/data/rules/store.svelte";

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      await initInitialData();
    }
  });
});
