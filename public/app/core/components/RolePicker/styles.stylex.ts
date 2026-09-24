import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

import {
  ROLE_PICKER_MENU_MAX_WIDTH,
  ROLE_PICKER_MENU_MIN_WIDTH,
  ROLE_PICKER_SUBMENU_MAX_WIDTH,
  ROLE_PICKER_SUBMENU_MIN_WIDTH,
} from './constants';

export const rolePickerStyles = stylex.create({
  hideScrollBar: {
    '.scrollbar-view': {
    /* Hide scrollbar for Chrome, Safari, and Opera */
    '&::-webkit-scrollbar': {
    display: 'none',
    },
    /* Hide scrollbar for Firefox */
    scrollbarWidth: 'none',
    },
  },
  menuWrapper: {
    display: 'flex',
    maxHeight: '650px',
    position: 'absolute',
    zIndex: grafanaTokens.zIndex_dropdown,
    overflow: 'hidden',
    minWidth: 'auto',
  },
  menu: {
    minWidth: `${ROLE_PICKER_MENU_MIN_WIDTH}px`,
    maxWidth: `${ROLE_PICKER_MENU_MAX_WIDTH}px`,
    ' > div': {
    paddingTop: themeSpacing(1),
    },
  },
  menuLeft: {
    flexDirection: 'row-reverse',
  },
  subMenu: {
    height: '100%',
    minWidth: `${ROLE_PICKER_SUBMENU_MIN_WIDTH}px`,
    maxWidth: `${ROLE_PICKER_SUBMENU_MAX_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: grafanaTokens.colors_border_medium,
    
    ' > div': {
    paddingTop: themeSpacing(1),
    },
  },
  subMenuLeft: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: grafanaTokens.colors_border_medium,
    borderLeftWidth: 0,
    borderLeftStyle: 'none',
  },
  groupHeader: {
    padding: themeSpacingShorthand(0, 4.5),
    display: 'flex',
    alignItems: 'center',
    color: grafanaTokens.colors_text_primary,
    fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  container: {
    padding: themeSpacing(1),
    border: `1px ${grafanaTokens.colors_border_weak} solid`,
    borderRadius: grafanaTokens.shape_radius_default,
    backgroundColor: grafanaTokens.colors_background_primary,
    zIndex: grafanaTokens.zIndex_modal,
  },
  menuSection: {
    marginBottom: themeSpacing(2),
  },
  menuOptionCheckbox: {
    display: 'flex',
    margin: themeSpacingShorthand(0, 1, 0, 0.25),
  },
  menuButtonRow: {
    backgroundColor: grafanaTokens.colors_background_primary,
    padding: themeSpacing(1),
  },
  menuOptionBody: {
    fontWeight: grafanaTokens.typography_fontWeightRegular,
    padding: themeSpacingShorthand(0, 1.5, 0, 0),
  },
  menuOptionDisabled: {
    color: grafanaTokens.colors_text_disabled,
    cursor: 'not-allowed',
  },
  menuOptionExpand: {
    position: 'absolute',
    right: themeSpacing(2.5),
    color: grafanaTokens.colors_text_disabled,
    
    '::after': {
    content: '">"',
    },
  },
  menuOptionInfoSign: {
    color: grafanaTokens.colors_text_disabled,
  },
  basicRoleSelector: {
    margin: themeSpacingShorthand(1, 1.25, 1, 1.5),
  },
  subMenuPortal: {
    height: '100%',
    ' > div': {
    height: '100%',
    },
  },
  subMenuButtonRow: {
    backgroundColor: grafanaTokens.colors_background_primary,
    padding: themeSpacing(1),
  },
  checkboxPartiallyChecked: {
    input: {
    ':checked + span': {
    '::after': {
    borderWidth: '0 3px 0px 0',
    transform: 'rotate(90deg)',
    },
    },
    },
  },
  loadingSpinner: {
    marginLeft: themeSpacing(1),
  },
});
