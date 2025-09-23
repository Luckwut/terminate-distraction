import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  getCurrentSiteUrl(): string;
  getHideRulesSelectors(data: { url: string }): string[];
  getCurrentTabId(): number | undefined;
  listenUrlChanges(): void;
  enableSelectorMode(): void;
  disableSelectorMode(): void;
  selectElementSelector(data: string): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();