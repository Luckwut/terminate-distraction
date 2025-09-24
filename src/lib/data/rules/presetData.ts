import { Rule } from '@/lib/data/rules/types';

export const presetData: Rule[] = [
  {
    id: crypto.randomUUID(),
    name: 'YouTube',
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
        siteUrl: 'www.youtube.com/',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Homepage feed',
            selector: 'div#contents',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'm.youtube.com/',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Homepage feed',
            selector:
              'ytm-app#app > div.page-container > ytm-browse.YtmBrowseHost > ytm-single-column-browse-results-renderer.modern-tabs > div > div.tab-content > ytm-tab-renderer > ytm-rich-grid-renderer > div.rich-grid-renderer-contents.rich-grid-top-margin:nth-of-type(2)',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'www.youtube.com/watch*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Related video',
            selector: 'div#items',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'm.youtube.com/watch*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Related video',
            selector:
              'ytm-app#app > div.page-container:nth-of-type(2) > ytm-watch.ambient-topbar > div.watch-below-the-player:nth-of-type(2) > ytm-single-column-watch-next-results-renderer.watch-content.full-bleed-wn-thumbs > div.related-items-container',
          },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'YouTube Shorts',
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
        siteUrl: 'www.youtube.com/',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Homepage shorts section',
            selector:
              'div#contents > ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer',
          },
        ],
      },

      {
        id: crypto.randomUUID(),
        siteUrl: 'www.youtube.com/watch*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Related video shorts section',
            selector:
              'div#contents > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'www.youtube.com/results*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Search shorts',
            selector:
              'div#contents > grid-shelf-view-model.ytGridShelfViewModelHost.ytd-item-section-renderer.ytGridShelfViewModelHostHasBottomButton',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'www.youtube.com/@*/shorts*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Account shorts',
            selector: 'div#contents',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'm.youtube.com/',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Homepage shorts section',
            selector:
              'ytm-tab-renderer > ytm-rich-grid-renderer > div.rich-grid-renderer-contents > ytm-rich-section-renderer:not(:has(ytm-backstage-post-renderer)) > div.rich-section-content',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'm.youtube.com/watch*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Related video shorts section',
            selector: 'ytm-reel-shelf-renderer.item',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'm.youtube.com/results*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Search shorts',
            selector:
              'ytm-app#app > div.page-container > ytm-search > ytm-section-list-renderer.no-bottom-separator > lazy-list > ytm-item-section-renderer > lazy-list > ytm-reel-shelf-renderer.item > div.reel-shelf-items',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'm.youtube.com/@*/shorts*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Account shorts',
            selector:
              'ytm-tab-renderer > ytm-rich-grid-renderer.is-shorts.is-shorts-gallery > div.rich-grid-renderer-contents:nth-of-type(2)',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: '*.youtube.com/shorts/*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'BLOCK_PAGE',
          },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Reddit',
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
        siteUrl: 'www.reddit.com/',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Homepage Feed',
            selector: '#subgrid-container',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'www.reddit.com/r/*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Subreddit Feed',
            selector: '#main-content > div:nth-child(4)',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'www.reddit.com/r/*/comments/*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Post right sidebar related',
            selector: '#right-sidebar-contents > aside:nth-child(3)',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'old.reddit.com/*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Old Homepage Feed',
            selector: 'body > div.content',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        siteUrl: 'old.reddit.com/r/*',
        actions: [
          {
            id: crypto.randomUUID(),
            type: 'HIDE_ELEMENT',
            label: 'Old Subreddit Feed',
            selector: '#siteTable',
          },
        ],
      },
    ],
  },
];
