import { Rule } from "@/lib/data/rules/types";

export const presetData: Rule[] = [
  {
    id: crypto.randomUUID(),
    name: "YouTube",
    enabled: false,
    option: {
      dailyLimit: 6,
      cooldownMinute: 5,
      unlockDurationMinute: 0,
      pauseBeforeUnlockSecond: 10,
      increasePausePerUnlockSecond: 0,
    },
    sites: [
      {
        id: crypto.randomUUID(),
        siteUrl: "*.youtube.com/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Homepage feed",
            selector: "#contents"
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "*.youtube.com/watch?v=*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Related video",
            selector: "#secondary"
          },
        ]
      },
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "YouTube Shorts",
    enabled: false,
    option: {
      dailyLimit: 6,
      cooldownMinute: 5,
      unlockDurationMinute: 5,
      pauseBeforeUnlockSecond: 10,
      increasePausePerUnlockSecond: 0,
    },
    sites: [
      {
        id: crypto.randomUUID(),
        siteUrl: "*.youtube.com/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Homepage feed shorts section",
            selector: "#contents > ytd-rich-section-renderer:nth-child(12)"
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "*.youtube.com/watch?v=*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Related video shorts section",
            selector: "#contents > ytd-reel-shelf-renderer"
          },
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "*.youtube.com/shorts/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "BLOCK_PAGE"
          }
        ]
      },
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Reddit",
    enabled: false,
    option: {
      dailyLimit: 6,
      cooldownMinute: 5,
      unlockDurationMinute: 5,
      pauseBeforeUnlockSecond: 10,
      increasePausePerUnlockSecond: 0,
    },
    sites: [
      {
        id: crypto.randomUUID(),
        siteUrl: "www.reddit.com/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Homepage Feed",
            selector: "#subgrid-container"
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "www.reddit.com/r/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Subreddit Feed",
            selector: "#main-content > div:nth-child(4)"
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "www.reddit.com/r/*/comments/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Post right sidebar related",
            selector: "#right-sidebar-contents > aside:nth-child(3)"
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "old.reddit.com/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Old Homepage Feed",
            selector: "body > div.content"
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        siteUrl: "old.reddit.com/r/*",
        actions: [
          {
            id: crypto.randomUUID(),
            type: "HIDE_ELEMENT",
            label: "Old Subreddit Feed",
            selector: "#siteTable"
          }
        ]
      },
    ]
  },
];