import { rulesStore } from "@/lib/ruleStore.svelte";

export default defineContentScript({
  matches: ['<all_urls>'],
  async main(ctx) {
    await rulesStore.load();

    const rules = rulesStore.rules ?? [];
    const currentUrl = window.location.href;

    console.log(currentUrl);

    if (!rules || rules.length === 0) {
      return;
    }

    for (const rule of rules) {
      if (!rule.enabled) continue;

      for (const site of rule.sites) {
        const pattern = new MatchPattern(`*://${site.siteUrl}`);
        
        if (pattern.includes(currentUrl)) {
            console.log(`MATCHED: ${currentUrl} matches rule "${rule.name}" on site pattern "${site.siteUrl}"`);
            document.body.innerHTML = '<h1>Blocked</h1>';
            return; 
          }
      }
    }

  },
});
