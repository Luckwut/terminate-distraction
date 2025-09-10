import { initPresetData, rulesStorage, rulesStore } from "@/lib/data/rules/store.svelte";
import type { Rule } from "@/lib/data/rules/types";
import { onMessage } from "@/lib/messaging";
import { MatchPattern } from "wxt/utils/match-patterns";

let patterns: MatchPattern[] = [];
let currentUrlFilters: Browser.events.UrlFilter[] = [];

function getBlockedSites(rules: Rule[]) {
  return rules
    .filter(rule => rule.enabled)
    .flatMap(rule => rule.sites)
    .filter(site => site.actions.some(a => a.type === "BLOCK_PAGE"));
}

async function refreshBlockedUrls() {
  await rulesStore.load();
  const rules = rulesStore.nonProxyRules;

  const blockedUrls = getBlockedSites(rules).map(site => site.siteUrl);

  patterns = blockedUrls.map(u => new MatchPattern("*://" + u));
}

async function handleBlock(
  details: Browser.webNavigation.WebNavigationParentedCallbackDetails |
    Browser.webNavigation.WebNavigationTransitionCallbackDetails
) {
  if (details.frameId !== 0) return;

  for (const p of patterns) {
    if (p.includes(details.url)) {
      await browser.tabs.goBack(details.tabId);
      browser.tabs.update(details.tabId, {
        url: browser.runtime.getURL("/blocked.html")
      });
      break;
    }
  }
}

function generateUrlFilters(rules: Rule[]): Browser.events.UrlFilter[] {
  const blockedHosts = new Set<string>();

  getBlockedSites(rules).forEach(site => {
    try {
      const host = new URL(`https://` + site.siteUrl.replace("*.", "")).hostname;
      blockedHosts.add(host);
    } catch (e) {
      console.warn(`Could not parse host from pattern: ${site.siteUrl}`);
    }
  });

  if (blockedHosts.size === 0) return [];

  console.log("Generating URL filters for hosts:", Array.from(blockedHosts));
  return Array.from(blockedHosts).map(host => ({ hostContains: host }));
}

async function updateOnHistoryStateUpdatedListener() {
  if (browser.webNavigation.onHistoryStateUpdated.hasListener(handleBlock)) {
    browser.webNavigation.onHistoryStateUpdated.removeListener(handleBlock);
  }

  currentUrlFilters = generateUrlFilters(rulesStore.nonProxyRules);

  if (currentUrlFilters.length > 0) {
    browser.webNavigation.onHistoryStateUpdated.addListener(handleBlock, {
      url: currentUrlFilters,
    });
  }
}

async function updateBlockingRules() {
  await refreshBlockedUrls();
  await updateOnHistoryStateUpdatedListener();
}

export default defineBackground(() => {
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  onMessage("getCurrentSiteUrl", async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0]?.url || "";
  });

  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      await initPresetData();
    }
    await updateBlockingRules();
  });

  browser.webNavigation.onBeforeNavigate.addListener(handleBlock);

  rulesStorage.watch(async () => {
    await updateBlockingRules();
  });

  (async () => {
    await updateBlockingRules();
  })();
});
