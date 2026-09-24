import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const rolePickerBadgesStyles = stylex.create({
  badge: {
    cursor: 'pointer',
  },
  badgeDisabled: {
    cursor: 'not-allowed',
  },
});
