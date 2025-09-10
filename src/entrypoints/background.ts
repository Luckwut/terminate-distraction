import { initPresetData } from "@/lib/data/rules/store.svelte";
import { onMessage } from "@/lib/messaging";

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      await initPresetData();
    }
  });

  onMessage('getCurrentSiteUrl', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0]?.url || '';
  });
});
