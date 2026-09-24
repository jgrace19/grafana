import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const annotationListItemStyles = stylex.create({
  card: {
    gridTemplateAreas: `"Heading Description Meta Tags"`,
          gridTemplateColumns: 'auto 1fr auto auto',
          padding: themeSpacing(1),
          margin: themeSpacing(0.5),
          width: 'inherit',
  },
  heading: {
    a: {
            zIndex: 1,
            position: 'relative',
            color: grafanaTokens.colors_text_link,
            ':hover': {
              textDecoration: 'underline',
            },
          },
  },
  meta: {
    margin: 0,
          position: 'relative',
          justifyContent: 'end',
  },
  timestamp: {
    margin: 0,
          alignSelf: 'center',
  },
  time: {
    marginLeft: themeSpacing(1),
          marginRight: themeSpacing(1),
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          color: grafanaTokens.colors_text_secondary,
  },
  avatar: {
    border: 'none',
          background: 'inherit',
          margin: 0,
          padding: themeSpacing(0.5),
          img: {
            borderRadius: grafanaTokens.shape_radius_circle,
            width: themeSpacing(2),
            height: themeSpacing(2),
          },
  },
});
