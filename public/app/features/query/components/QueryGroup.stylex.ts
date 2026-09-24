import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../core/stylex/spacing';

export const queryGroupStyles = stylex.create({
  innerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: themeSpacing(2),
  },
  dataSourceRow: {
    display: 'flex',
    marginBottom: themeSpacing(2),
  },
  dataSourceRowItem: {
    marginRight: themeSpacing(1),
  },
  dataSourceRowItemOptions: {
    flexGrow: 1,
    marginRight: themeSpacing(1),
  },
  queriesWrapper: {
    paddingBottom: '16px',
  },
  expressionWrapper: {},
  expressionButton: {
    marginRight: themeSpacing(1),
  },
});
