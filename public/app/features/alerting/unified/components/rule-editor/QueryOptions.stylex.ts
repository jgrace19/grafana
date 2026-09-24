import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const queryOptionsStyles = stylex.create({
  queryOptions: {
    '> div': {
            justifyContent: 'space-between',
          },
  },
  staticValues: {
    color: grafanaTokens.colors_text_secondary,
          marginRight: themeSpacing(1),
  },
  actionLink: {
    color: grafanaTokens.colors_text_link,
          cursor: 'pointer',
    
          ':hover': {
            textDecoration: 'underline',
          },
  },
});
