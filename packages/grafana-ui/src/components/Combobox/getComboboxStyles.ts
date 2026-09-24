import * as stylex from '@stylexjs/stylex';

import { zIndex } from '../../themes/stylex/constants.stylex';
import { colors, components, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';

// We need a px font size to accurately measure the width of items.
// This should be in sync with the body font size in the theme.
const MENU_ITEM_FONT_SIZE = 14;
const MENU_ITEM_DESCRIPTION_FONT_SIZE = 12;
const MENU_ITEM_FONT_WEIGHT = 500;
const MENU_ITEM_PADDING = 8;
const MENU_ITEM_GAP = 2;
const MENU_ITEM_LINE_HEIGHT = 1.5;

// Used with Downshift to get the height of each item
const MENU_OPTION_HEIGHT = MENU_ITEM_GAP + MENU_ITEM_PADDING * 2 + MENU_ITEM_FONT_SIZE * MENU_ITEM_LINE_HEIGHT;
const MENU_OPTION_HEIGHT_DESCRIPTION = MENU_OPTION_HEIGHT + MENU_ITEM_DESCRIPTION_FONT_SIZE * MENU_ITEM_LINE_HEIGHT;
const POPOVER_MAX_HEIGHT = MENU_OPTION_HEIGHT * 8.5;

// Plain (non-exported) consts so the StyleX lint rules can resolve them inside stylex.create.
export {
  MENU_ITEM_FONT_SIZE,
  MENU_ITEM_DESCRIPTION_FONT_SIZE,
  MENU_ITEM_FONT_WEIGHT,
  MENU_ITEM_PADDING,
  MENU_ITEM_GAP,
  MENU_ITEM_LINE_HEIGHT,
  MENU_OPTION_HEIGHT,
  MENU_OPTION_HEIGHT_DESCRIPTION,
  POPOVER_MAX_HEIGHT,
};

const forcedColors = '@media (forced-colors: active), (prefers-contrast: more)';

// Shared by Combobox, MultiCombobox and ComboboxList; they sit here next to the MENU_* sizes they use.
export const comboboxStyles = stylex.create({
  menuClosed: {
    display: 'none',
  },
  menu: {
    backgroundColor: components['--gf-components-dropdown-background'],
    boxShadow: shadows['--gf-shadows-z3'],
    zIndex: zIndex.dropdown,
    position: 'relative',
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
  },
  clear: {
    cursor: 'pointer',
    pointerEvents: 'auto',
    color: { default: null, ':hover': colors['--gf-colors-text-primary'] },
  },
  menuUlContainer: {
    listStyle: 'none',
  },

  // The wrapper around the group header and option, not the option itself.
  // Should not contain visual styling itself.
  listItem: {
    position: 'absolute',
    width: '100%',
  },

  optionGroupHeader: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
  },

  optionFirstGroupHeader: {
    borderTopStyle: 'none',
  },

  optionGroupLabel: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    letterSpacing: 0,
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-light'],
    padding: MENU_ITEM_PADDING,
  },

  // Every state keeps the hover background: the Emotion :hover rule out-ranked the state classes.
  option: {
    position: 'relative', // for the selection gradient to grab to
    display: 'flex',
    width: '100%',
    gap: spacing['--gf-spacing-x1'],
    alignItems: 'center',
    padding: MENU_ITEM_PADDING,
    marginBottom: MENU_ITEM_GAP,
    borderRadius: shape['--gf-shape-radius-default'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
    borderWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderColor: { default: null, ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] } },
  },

  optionAccessory: {
    height: MENU_ITEM_FONT_SIZE * MENU_ITEM_LINE_HEIGHT, // Ensure the accessory doesn't make the option too tall
  },

  optionBody: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },

  optionLabel: {
    fontSize: MENU_ITEM_FONT_SIZE,
    fontWeight: MENU_ITEM_FONT_WEIGHT,
    lineHeight: MENU_ITEM_LINE_HEIGHT,
    letterSpacing: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },

  optionDescription: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: MENU_ITEM_DESCRIPTION_FONT_SIZE,
    fontWeight: typography['--gf-typography-font-weight-regular'],
    lineHeight: MENU_ITEM_LINE_HEIGHT,
    letterSpacing: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },

  optionFocused: {
    backgroundColor: { default: colors['--gf-colors-action-focus'], ':hover': colors['--gf-colors-action-hover'] },
    borderWidth: { default: null, [forcedColors]: '1px' },
    borderStyle: { default: null, [forcedColors]: 'solid' },
    borderColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
  },
  optionSelected: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      width: spacing['--gf-spacing-x0-5'],
      left: 0,
      top: 0,
    },
  },
  optionInfo: {
    color: colors['--gf-colors-text-disabled'],
    cursor: 'not-allowed',
    pointerEvents: 'none',
    backgroundColor: { default: null, ':hover': 'transparent' },
  },
});
