import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

export const alertingPaginationStyles = stylex.create({
  pagination: {
    float: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
  rulesTable: {
    display: 'flex',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-25'],
    justifyContent: 'center',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-medium'],
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-medium'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    float: 'none',
  },
});
