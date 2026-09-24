import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

import { SIDEBAR_CARD_INDENT, SIDEBAR_CARD_SPACING } from '../../../constants';

export const sidebarCardStyles = stylex.create({
  wrapper: {
    position: 'relative',
    marginLeft: themeSpacing(SIDEBAR_CARD_INDENT),
    marginRight: themeSpacing(SIDEBAR_CARD_INDENT),
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: themeSpacing(-3.5),
      width: themeSpacing(3.5),
      height: `calc(100% + ${themeSpacing(1.5)})`,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: themeSpacing(-3.5),
      width: `calc(100% + ${themeSpacing(3.5)})`,
      height: themeSpacing(1.5),
    },
    ':hover': {
      zIndex: 1,
    },
    ':hover [data-add-button], [data-menu-open]': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
  ghostWrapper: {
    marginTop: themeSpacing(SIDEBAR_CARD_SPACING),
  },
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: grafanaTokens.shape_radius_default,
    cursor: 'pointer',
    overflow: 'hidden',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: themeSpacing(1),
    padding: themeSpacingShorthand(0.5, 1, 0.5, 1.25),
    overflow: 'hidden',
    minWidth: 0,
    flex: 1,
  },
  cardContentIcons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: themeSpacing(1),
    marginRight: themeSpacing(1.5),
  },
  hoverActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    paddingRight: themeSpacing(1),
    paddingLeft: themeSpacing(3),
    borderRadius: `0 ${grafanaTokens.shape_radius_default} ${grafanaTokens.shape_radius_default} 0`,
    opacity: 0,
    transform: 'translateX(8px)',
    pointerEvents: 'none',
  },
  hoverActionsVisible: {
    opacity: 1,
    transform: 'translateX(0)',
    pointerEvents: 'auto',
  },
  ghostCard: {
    cursor: 'default',
    opacity: 1,
  },
  ghostCardIcon: {
    color: grafanaTokens.colors_text_secondary,
  },
  ghostCardLabel: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
    fontStyle: 'italic',
    color: grafanaTokens.colors_text_secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
