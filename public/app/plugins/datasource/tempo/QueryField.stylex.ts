import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryFieldStyles = stylex.create({
  inline0: {
    padding: this.props.themeSpacing(2)
  },
  inline1: {
    marginBottom: this.props.themeSpacing(1)
  },
});
