import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const stylesStyles = stylex.create({
  dashlistLink: {
    display: 'flex',
          borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
          margin: themeSpacing(1),
          padding: themeSpacing(1),
          alignItems: 'center',
          a: {
            flex: 1,
            ':hover': {
              '> p': {
                '&:first-child': {
                  color: grafanaTokens.colors_text_link,
                  textDecoration: 'underline',
                },
              },
            },
          },
  },
  dashlistCardContainer: {
    display: 'block',
          height: '100%',
          paddingTop: themeSpacing(1.25),
          paddingBottom: themeSpacing(1.25),
          '&:has(a:hover)': {
            backgroundImage: gradient,
            color: grafanaTokens.colors_text_primary,
          },
  },
  dashlistCard: {
    display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: themeSpacing(0.75),
          height: '100%',
          width: '100%',
          ':hover': {
            '> div': {
              '&:first-child': {
                color: grafanaTokens.colors_text_link,
                textDecoration: 'underline',
              },
            },
          },
  },
  dashlistCardIcon: {
    marginRight: themeSpacing(0.25),
          marginTop: themeSpacing(0.25),
  },
  dashlistCardLink: {
    paddingTop: themeSpacing(0.5),
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        '@media (max-width: 991.95px)': {
            WebkitLineClamp: 1,
          },
  },
  dashlistCardFolder: {
    display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          overflow: 'hidden',
          whiteSpace: 'normal',
  },
});
