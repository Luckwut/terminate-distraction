import { rulesStorage } from "@/lib/data/rules/store.svelte";
import { sendMessage } from "@/lib/messaging";

const STYLE_ID = "terminate-distraction-ext-element-hider-styles";

function applyCssHiding(selectors: string[]) {
  const existingStyle = document.getElementById(STYLE_ID);

  if (selectors.length === 0) {
    if (existingStyle) {
      existingStyle.remove();
    }
    return;
  }

  const cssRule = `${selectors.join(", ")} { display: none !important; }`;

  if (existingStyle) {
    existingStyle.textContent = cssRule;
  } else {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = cssRule;
    document.head.appendChild(style);
  }
}

async function runHidingLogic(url: string) {
  const selectorsToHide = await sendMessage("getHideRulesSelectors", { url });
  applyCssHiding(selectorsToHide);
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: "document_idle",
  main(ctx) {
    runHidingLogic(window.location.href);
    ctx.addEventListener(window, "wxt:locationchange", (event) => {
      console.log(`SPA Navigation detected. New URL: ${event.newUrl}`);
      runHidingLogic(event.newUrl.toString());
    });

    rulesStorage.watch(async () => {
      runHidingLogic(window.location.href);
    });
  },
});
