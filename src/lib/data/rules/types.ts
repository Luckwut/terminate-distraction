export interface HideElementAction {
  id: string;
  type: "HIDE_ELEMENT";
  label: string;
  selector: string;
}

export interface BlockPageAction {
  id: string;
  type: "BLOCK_PAGE";
}

export interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  option: {
    dailyLimit: number;
    cooldownMinute: number;
    unlockDurationMinute: number;
    pauseBeforeUnlockSecond: number;
    increasePausePerUnlockSecond: number;
  };
  sites: Site[];
}

export interface Site {
  id: string;
  siteUrl: string;
  actions: Action[];
}

export type Action = HideElementAction | BlockPageAction;