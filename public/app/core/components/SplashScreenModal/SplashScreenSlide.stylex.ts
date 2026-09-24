import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const splashScreenSlideStyles = stylex.create({
  slide: {
    display: 'flex',
          height: '100%',
  },
  heroPanel: {
    flex: '0 0 45%',
          background: `url(${heroImageUrl
  },
  contentPanel: {
    flex: '1 1 55%',
          padding: themeSpacing(4),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'auto',
  },
  badge: {
    alignSelf: 'flex-start',
  },
  title: {
    .../* UNMAPPED theme.typography.h3 */ 'inherit',
          margin: 0,
  },
  body: {
    display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(1.5),
  },
  subtitle: {
    margin: 0,
  },
  iconBox: {
    width: 40,
          height: 40,
          borderRadius: grafanaTokens.shape_radius_default,
          backgroundColor: colorManipulator.alpha(accentColor, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
  },
  iconBoxIcon: {
    color: accentColor,
  },
  bulletList: {
    listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(1.5),
  },
  bulletItem: {
    display: 'flex',
          alignItems: 'flex-start',
          gap: themeSpacing(1.5),
  },
  bulletDot: {
    width: 6,
          height: 6,
          minWidth: 6,
          borderRadius: grafanaTokens.shape_radius_circle,
          backgroundColor: accentColor,
          // Vertically aligns the dot with the first line of text
          marginTop: themeSpacing(0.75),
  },
  bulletText: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
  },
  footer: {
    display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: themeSpacing(2),
  },
});
