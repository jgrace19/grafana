import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const permissionListItemStyles = stylex.create({
  warning: {
    color: grafanaTokens.colors_warning_main,
  },
  inherited: {
    color: grafanaTokens.colors_text_secondary,
        flexWrap: 'nowrap',
  },
});
