import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const singleTopBarStyles = stylex.create({
  layout: {
    height: getChromeHeaderLevelHeight(),
        display: 'flex',
        gap: themeSpacing(2),
        alignItems: 'center',
        padding: themeSpacingShorthand(0, 1),
        paddingLeft: menuDockedAndOpen ? themeSpacing(3.5) : themeSpacing(0.75),
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        justifyContent: 'space-between',
  },
  breadcrumbsWrapper: {
    display: 'flex',
        overflow: 'hidden',
        [@media (max-width: 543.95px)]: {
          minWidth: '40%',
        },
  },
  img: {
    alignSelf: 'center',
        height: themeSpacing(3),
        width: themeSpacing(3),
  },
  kioskToggle: {
    [@media (max-width: 991.95px)]: {
          display: 'none',
        },
  },
});
