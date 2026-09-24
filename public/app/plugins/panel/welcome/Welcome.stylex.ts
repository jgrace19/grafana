import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const welcomeStyles = stylex.create({
  container: {
    display: 'flex',
          backgroundSize: 'cover',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: themeSpacingShorthand(0, 3),
        '@media (max-width: 991.95px)': {
            backgroundPosition: '0px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          },
        '@media (max-width: 543.95px)': {
            padding: themeSpacingShorthand(0, 1),
          },
  },
  title: {
    marginBottom: 0,
        '@media (max-width: 991.95px)': {
            marginBottom: themeSpacing(1),
          },
        '@media (max-width: 768.95px)': {
            fontSize: grafanaTokens.typography_h2_fontSize,
          },
        '@media (max-width: 543.95px)': {
            fontSize: grafanaTokens.typography_h3_fontSize,
          },
  },
  help: {
    display: 'flex',
          alignItems: 'baseline',
  },
  helpText: {
    fontSize: grafanaTokens.typography_h3_fontSize,
          marginRight: themeSpacing(2),
          marginBottom: 0,
        '@media (max-width: 768.95px)': {
            fontSize: grafanaTokens.typography_h4_fontSize,
          },
        '@media (max-width: 543.95px)': {
            display: 'none',
          },
  },
  helpLinks: {
    display: 'flex',
          flexWrap: 'wrap',
          gap: themeSpacing(2),
          textWrap: 'nowrap',
        '@media (max-width: 543.95px)': {
            gap: themeSpacing(1),
          },
  },
});
