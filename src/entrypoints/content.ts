import { rulesStorage } from '@/lib/data/rules/store.svelte';
import { onMessage, sendMessage } from '@/lib/messaging';

const STYLE_ID = 'terminate-distraction-ext-element-hider-styles';

function applyCssHiding(selectors: string[]) {
  const existingStyle = document.getElementById(STYLE_ID);

  if (selectors.length === 0) {
    if (existingStyle) {
      existingStyle.remove();
    }
    return;
  }

  const cssRule = `${selectors.join(', ')} { display: none !important; }`;

  if (existingStyle) {
    existingStyle.textContent = cssRule;
  } else {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = cssRule;
    document.head.appendChild(style);
  }
}

async function runHidingLogic(url: string) {
  const selectorsToHide = await sendMessage('getHideRulesSelectors', { url });
  applyCssHiding(selectorsToHide);
}

function getUniqueCssSelector(elem: HTMLElement): string {
  const MAX_TRAVERSAL_LEVEL = 10;
  let path = '';
  let level = 0;
  while (elem && level++ < MAX_TRAVERSAL_LEVEL) {
    let sn = elem.nodeName.toLowerCase();
    let realName = sn;
    let id = elem.getAttribute('id');
    if (id && id.length > 0) {
      if (id.match(/^[0-9]/) != null)
        id = '\\3' + id[0] + ' ' + id.substring(1);
      path = '#' + id + (path.length > 0 ? ' > ' + path : '');
      return sn + path;
    }
    let classes = elem.className;
    if (classes) classes = '.' + classes.replace(/\s+/g, '.');
    let nth = 1;
    let sib = elem;
    while ((sib = sib.previousElementSibling as HTMLElement)) {
      if (sib.nodeName.toLowerCase() == realName) nth++;
    }
    if (nth == 1) nth = 0;
    path =
      realName +
      classes +
      (nth > 0 ? ':nth-of-type(' + nth + ')' : '') +
      (path.length > 0 ? ' > ' + path : '');
    elem = elem.parentNode as HTMLElement;
  }
  return path;
}

// Selector mode logic with overlay
let isSelectorMode = false;
let overlay: HTMLDivElement | null = null;

function createOverlay() {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999999999'; // High z-index
    document.body.appendChild(overlay);
  }
}

function updateOverlayPosition(target: HTMLElement) {
  if (!overlay) return;
  const rect = target.getBoundingClientRect();
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

function removeOverlay() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

function enableSelectorMode() {
  if (isSelectorMode) return;
  isSelectorMode = true;
  createOverlay();
  document.body.style.cursor = 'crosshair';
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleSelectClick, { capture: true });
}

function disableSelectorMode() {
  isSelectorMode = false;
  removeOverlay();
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleSelectClick, { capture: true });
}

function handleMouseMove(e: MouseEvent) {
  if (!isSelectorMode) return;
  const target = e.target as HTMLElement;
  if (target && overlay) {
    updateOverlayPosition(target);
  }
}

function handleSelectClick(e: MouseEvent) {
  if (!isSelectorMode) return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  const target = e.target as HTMLElement;
  if (!target) return;
  const selector = getUniqueCssSelector(target);
  sendMessage('selectElementSelector', selector);
  disableSelectorMode();
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main(ctx) {
    runHidingLogic(window.location.href);
    ctx.addEventListener(window, 'wxt:locationchange', (event) => {
      console.log(`SPA Navigation detected. New URL: ${event.newUrl}`);
      runHidingLogic(event.newUrl.toString());

      sendMessage('listenUrlChanges');
    });

    rulesStorage.watch(async () => {
      runHidingLogic(window.location.href);
    });

    onMessage('enableSelectorMode', () => {
      enableSelectorMode();
    });
    onMessage('disableSelectorMode', () => {
      disableSelectorMode();
    });
  },
});
