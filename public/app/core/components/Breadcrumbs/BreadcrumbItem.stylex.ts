import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const breadcrumbItemStyles = stylex.create({
  breadcrumb: {
    display: 'block',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: grafanaTokens.colors_text_secondary,
  },
  breadcrumbLink: {
    color: grafanaTokens.colors_text_primary,
          ':hover': {
            textDecoration: 'underline',
          },
  },
  breadcrumbWrapper: {
    alignItems: 'center',
          color: grafanaTokens.colors_text_primary,
          display: 'flex',
          flex: 1,
          gap: themeSpacing(0.5),
          minWidth: 0,
          maxWidth: 'max-content',
          padding: themeSpacingShorthand(0.5, 0, 0.5, 0.5),
    
          // logic for small screens
          // hide any breadcrumbs that aren't the second to last child (the parent)
          // unless there's only one breadcrumb, in which case we show it
          [@media (max-width: 543.95px)]: {
            display: 'none',
            ':nth-last-child(2)': {
              display: 'flex',
              minWidth: '40px',
            },
            ':last-child': {
              display: 'flex',
            },
          },
  },
  separator: {
    color: grafanaTokens.colors_text_secondary,
  },
});
