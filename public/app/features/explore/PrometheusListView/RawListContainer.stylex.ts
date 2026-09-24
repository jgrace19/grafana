import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const rawListContainerStyles = stylex.create({
  wrapper: {
    height: '100%',
        overflow: 'scroll',
  },
  switchWrapper: {
    display: 'flex',
        flexDirection: 'row',
        marginBottom: 0,
  },
  switchLabel: {
    marginLeft: '15px',
        marginBottom: 0,
  },
  switch: {
    marginLeft: '10px',
  },
  resultCount: {
    marginBottom: '4px',
  },
  header: {
    display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        fontSize: '12px',
        lineHeight: 1.25,
  },
});
