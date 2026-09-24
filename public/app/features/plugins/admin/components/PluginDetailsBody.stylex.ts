import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const pluginDetailsBodyStyles = stylex.create({
  wrap: {
    width: '100%',
        height: '65vh',
  },
  readme: {
    '& img': {
          maxWidth: '100%',
        },
        'h1, h2, h3': {
          marginTop: themeSpacing(3),
          marginBottom: themeSpacing(2),
        },
        '*:first-child': {
          marginTop: 0,
        },
        li: {
          marginLeft: themeSpacing(2),
          '& > p': {
            margin: themeSpacingShorthand(1, 0),
          },
          code: {
            whiteSpace: 'pre-wrap',
          },
        },
        a: {
          color: grafanaTokens.colors_text_link,
          ':hover': {
            color: grafanaTokens.colors_text_link,
            textDecoration: 'underline',
          },
        },
        table: {
          tableLayout: 'fixed',
          width: '100%',
          'td, th': {
            overflowX: 'auto',
            padding: themeSpacingShorthand(0.5, 1),
          },
          'table, th, td': {
            border: `1px solid ${grafanaTokens.colors_border_medium}`,
            borderCollapse: 'collapse',
          },
        },
  },
});
