import { Rule } from "@/lib/types";

export const ruleMockData: Rule[] = [
    {
        id: crypto.randomUUID(),
        name: "YouTube",
        enabled: true,
        option: {
            dailyLimit: 6,
            cooldownMinute: 5,
            unlockDurationMinute: 0,
            pauseBeforeUnlockSecond: 10,
            increasePausePerUnlockSecond: 1,
        },
        sites: [
            {
                id: crypto.randomUUID(),
                siteUrl: "*.youtube.com",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Youtube Homepage Feed",
                        selector: "#feed"
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
                        label: "Youtube Video Related Feed",
                        selector: "#video-feed"
                    },
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Youtube Video Comment",
                        selector: "#video-feed"
                    },
                ]
            },
            {
                id: crypto.randomUUID(),
                siteUrl: "*.youtube.com/shorts/*",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "BLOCK_PAGE",
                        label: "Youtube Shorts Block"
                    }
                ]
            },
        ]
    },
    {
        id: crypto.randomUUID(),
        name: "Reddit",
        enabled: true,
        option: {
            dailyLimit: 4,
            cooldownMinute: 10,
            unlockDurationMinute: 15,
            pauseBeforeUnlockSecond: 5,
            increasePausePerUnlockSecond: 2,
        },
        sites: [
            {
                id: crypto.randomUUID(),
                siteUrl: "*.reddit.com",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Reddit Front Page Posts",
                        selector: "div[data-testid='post-container']"
                    }
                ]
            },
            {
                id: crypto.randomUUID(),
                siteUrl: "*.reddit.com/r/*/comments/*",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Reddit Comment Section",
                        selector: "div[data-testid='comment']"
                    }
                ]
            }
        ]
    },
    {
        id: crypto.randomUUID(),
        name: "Twitter",
        enabled: false,
        option: {
            dailyLimit: 3,
            cooldownMinute: 15,
            unlockDurationMinute: 5,
            pauseBeforeUnlockSecond: 20,
            increasePausePerUnlockSecond: 5,
        },
        sites: [
            {
                id: crypto.randomUUID(),
                siteUrl: "twitter.com",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "BLOCK_PAGE",
                        label: "Twitter Full Block"
                    }
                ]
            },
            {
                id: crypto.randomUUID(),
                siteUrl: "twitter.com/home",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Twitter Timeline Feed",
                        selector: "section[aria-labelledby='accessible-list-0']"
                    }
                ]
            }
        ]
    },
    {
        id: crypto.randomUUID(),
        name: "Netflix",
        enabled: true,
        option: {
            dailyLimit: 2,
            cooldownMinute: 60,
            unlockDurationMinute: 120,
            pauseBeforeUnlockSecond: 30,
            increasePausePerUnlockSecond: 10,
        },
        sites: [
            {
                id: crypto.randomUUID(),
                siteUrl: "*.netflix.com",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Netflix Autoplay Previews",
                        selector: ".previewModal--player-container"
                    }
                ]
            },
            {
                id: crypto.randomUUID(),
                siteUrl: "*.netflix.com/browse",
                actions: [
                    {
                        id: crypto.randomUUID(),
                        type: "HIDE_ELEMENT",
                        label: "Netflix Recommendations Row",
                        selector: ".lolomoRow"
                    }
                ]
            }
        ]
    },
];