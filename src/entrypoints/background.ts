export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      // TODO: Initialize the presets
    }
  });
});
