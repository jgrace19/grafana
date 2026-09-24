import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const queryEditorFooterStyles = stylex.create({
  container: {
    position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          backgroundColor: themeColors.footerBackground,
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderBottomLeftRadius: grafanaTokens.shape_radius_default,
          borderBottomRightRadius: grafanaTokens.shape_radius_default,
          padding: themeSpacingShorthand(0, 0.5, 0, 1.5),
          zIndex: grafanaTokens.zIndex_navbarFixed,
          height: FOOTER_HEIGHT,
          overflow: 'hidden',
  },
  itemsList: {
    display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
  },
  itemButton: {
    padding: themeSpacingShorthand(0, 0.5),
          '& > span': {
            display: 'flex',
            alignItems: 'center',
            gap: themeSpacing(0.5),
          },
  },
  label: {
    color: grafanaTokens.colors_text_primary,
  },
  value: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
  },
  valueActive: {
    color: grafanaTokens.colors_success_text,
  },
  activeIndicator: {
    width: 6,
          height: 6,
          borderRadius: grafanaTokens.shape_radius_circle,
          backgroundColor: grafanaTokens.colors_success_text,
          flexShrink: 0,
  },
  chevron: {
    ['@media (prefers-reduced-motion: no-preference)']: {
            },
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  queryOptionsWrapper: {
    flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
    
          // TODO: Add this back once all the new colors are finalized
          // '::before': {
          //   content: '""',
          //   position: 'absolute',
          //   right: '100%',
          //   top: 0,
          //   bottom: 0,
          //   width: themeSpacing(4),
          //   background: `linear-gradient(to right, transparent, ${getQueryEditorColors(theme).footerBackground})`,
          //   pointerEvents: 'none',
          // },
  },
});
