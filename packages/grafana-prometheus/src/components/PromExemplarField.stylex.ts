import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const promExemplarFieldStyles = stylex.create({
  eyeIcon: {
    marginLeft: grafanaTokens.spacing_x2,
  },
  activeIcon: {
    color: grafanaTokens.colors_primary_main,
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});
