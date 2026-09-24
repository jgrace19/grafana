import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const partListSectionStyles = stylex.create({
  noRightMarginPaddingClass: {
    paddingRight: '0',
      marginRight: '0',
  },
  noHorizMarginPaddingClass: {
    paddingLeft: '0',
      paddingRight: '0',
      marginLeft: '0',
      marginRight: '0',
  },
});
