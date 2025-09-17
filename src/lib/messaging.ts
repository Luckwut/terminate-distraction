import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  getCurrentSiteUrl(): string;
  getHideRulesSelectors(data: { url: string }): string[];
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();