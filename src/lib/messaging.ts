import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  getCurrentSiteUrl(): string;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();