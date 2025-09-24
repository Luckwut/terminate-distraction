import { Rule } from '@/lib/data/rules/types';

function createEmptyRule(): Rule {
  return {
    id: crypto.randomUUID(),
    name: '',
    enabled: true,
    option: {
      dailyLimit: 0,
      cooldownMinute: 0,
      unlockDurationMinute: 0,
      pauseBeforeUnlockSecond: 0,
      increasePausePerUnlockSecond: 0,
    },
    sites: [],
  };
}

let rule = $state<Rule>(createEmptyRule());

export const ruleFormStore = {
  get currentRule() {
    return rule;
  },
  reset() {
    rule = createEmptyRule();
  },
  setRule(newRule: Rule) {
    rule = { ...newRule };
  },
};
