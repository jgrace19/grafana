import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const importToGMAStyles = stylex.create({
  successIcon: {
    color: grafanaTokens.colors_success_main
  },
  warningIcon: {
    color: grafanaTokens.colors_warning_main
  },
  errorIcon: {
    color: grafanaTokens.colors_error_main
  },
});
