import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const megaMenuItemStyles = stylex.create({
  icon: {
    width: themeSpacing(3),
  },
  img: {
    height: themeSpacing(2),
        width: themeSpacing(2),
  },
  listItem: {
    flex: 1,
        maxWidth: '100%',
  },
  menuItem: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1.5),
        height: themeSpacing(4),
        position: 'relative',
  },
  collapseButtonWrapper: {
    display: 'flex',
        justifyContent: 'center',
        width: themeSpacing(3),
        flexShrink: 0,
  },
  itemConnector: {
    position: 'relative',
        height: '100%',
        width: themeSpacing(1.5),
        '&::before': {
          borderLeft: `1px solid ${grafanaTokens.colors_border_medium}`,
          content: '""',
          height: '100%',
          right: 0,
          position: 'absolute',
          transform: 'translateX(50%)',
        },
  },
  collapseButton: {
    margin: 0,
  },
  collapsibleSectionWrapper: {
    alignItems: 'center',
        display: 'flex',
        flex: 1,
        height: '100%',
        minWidth: 0,
  },
  labelWrapper: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        paddingLeft: themeSpacing(1),
        minWidth: 0,
  },
  hasActiveChild: {
    color: grafanaTokens.colors_text_primary,
  },
  labelWrapperWithIcon: {
    minWidth: themeSpacing(7),
        paddingLeft: themeSpacing(0.5),
  },
  children: {
    display: 'flex',
        listStyleType: 'none',
        flexDirection: 'column',
  },
  emptyMessage: {
    color: grafanaTokens.colors_text_secondary,
        fontStyle: 'italic',
        padding: themeSpacingShorthand(1, 1.5, 1, 7),
  },
});
