import * as stylex from '@stylexjs/stylex';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardControlsStyles = stylex.create({
  skeletonContainer: {
    display: 'inline-flex',
    lineHeight: 1,
    verticalAlign: 'middle',
    marginBottom: themeSpacing(1),
    marginRight: themeSpacing(1),
  },
  controls: {
    gap: themeSpacing(1),
    padding: themeSpacingShorthand(2, 2, 1, 2),
    flexDirection: 'row',
    flexWrap: 'nowrap',
    position: 'relative',
    width: '100%',
    marginLeft: 'auto',
    display: 'inline-block',
    ['@media (max-width: 543.95px)']: {
      flexDirection: 'column-reverse',
      alignItems: 'stretch',
    },
    ':hover .dashboard-canvas-controls': {
      opacity: 1,
    },
  },
  controlsPanelEdit: {
    flexWrap: 'wrap-reverse',
    paddingRight: 0,
  },
  controlsPanelEditNext: {
    padding: 0,
    marginBottom: themeSpacing(-1),
  },
  embedded: {
    background: 'unset',
    position: 'unset',
  },
  rightControls: {
    display: 'flex',
    gap: themeSpacing(1),
    float: 'right',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: '100%',
    minWidth: 0,
  },
  fixedControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: themeSpacing(1),
    marginBottom: themeSpacing(1),
    order: 2,
    marginLeft: 'auto',
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  dashboardControlsButton: {
    order: 2,
    marginLeft: 'auto',
  },
  rightControlsWrap: {
    flexWrap: 'wrap',
    marginLeft: 'auto',
  },
  contextualNavToggle: {
    display: 'inline-flex',
    margin: themeSpacingShorthand(0, 1, 1, 0),
  },
});
