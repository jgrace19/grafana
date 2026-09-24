import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const annoListPanelStyles = stylex.create({
  noneFound: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'calc(100% - 30px)',
  },
  filter: {
    alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: themeSpacing(0.5),
        padding: themeSpacing(0.5),
  },
  tagList: {
    justifyContent: 'flex-start',
        'li > button': {
          paddingLeft: '3px',
        },
  },
});
