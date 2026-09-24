import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const nestedQueryStyles = stylex.create({
  card: {
    display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(0.5),
  },
  header: {
    padding: themeSpacingShorthand(0.5, 0.5, 0.5, 1),
          gap: themeSpacing(1),
          display: 'flex',
          alignItems: 'center',
  },
  name: {
    whiteSpace: 'nowrap',
  },
  body: {
    paddingLeft: themeSpacing(2),
  },
  vectorMatchInput: {
    marginLeft: -1,
  },
  vectorMatchWrapper: {
    display: 'flex',
  },
});
