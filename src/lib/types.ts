interface HideElementAction {
    id: string;
    type: "HIDE_ELEMENT";
    label: string;
    selector: string;
}

interface BlockPageAction {
    id: string;
    type: "BLOCK_PAGE";
    label: string;
}

export interface Rule {
    id: string;
    name: string;
    enabled: boolean;
    option: {
        dailyLimit: number | null;
        cooldownMin: number | null;
        unlockDurationMin: number | null;
        pauseBeforeUnlockSec: number | null;
        increasePausePerUnlockSec: number | null;
    };
    sites: Site[];
}

export interface Site {
    id: string;
    siteUrl: string;
    actions: Action[];
}

export type Action = HideElementAction | BlockPageAction;