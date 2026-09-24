import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const leftSideBarStyles = stylex.create({
  inlineField: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
  },
  sidebarText: {
    display: 'flex',
        flexDirection: 'column',
  },
  sidebarLabel: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        lineHeight: 1,
  },
  sidebarOptional: {
    marginTop: 0,
        marginBottom: 0,
        lineHeight: 1,
  },
});
