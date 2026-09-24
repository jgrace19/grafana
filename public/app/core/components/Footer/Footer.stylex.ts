import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const footerStyles = stylex.create({
  footer: {
    .../* UNMAPPED theme.typography.bodySmall */ 'inherit',
        color: grafanaTokens.colors_text_primary,
        display: 'block',
        padding: themeSpacingShorthand(2, 0),
        position: 'relative',
        width: '98%',
    
        'a:hover': {
          color: grafanaTokens.colors_text_maxContrast,
          textDecoration: 'underline',
        },
    
        [@media (max-width: 768.95px)]: {
          display: 'none',
        },
  },
  list: {
    listStyle: 'none',
  },
  listItem: {
    display: 'inline-block',
        '::after': {
          content: "' | '",
          padding: themeSpacingShorthand(0, 1),
        },
        '&:last-child:after': {
          content: "''",
          paddingLeft: 0,
        },
  },
});
