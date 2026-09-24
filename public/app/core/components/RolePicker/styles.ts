import * as stylex from '@stylexjs/stylex';

import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

const forcedColors = '@media (forced-colors: active), (prefers-contrast: more)';

// Select's option styles (as SelectMenuOptions renders them), plus the RolePicker's own option overrides.
// Every background keeps the hover colour: the Emotion :hover rule out-ranked the state classes.
export const optionStyles = stylex.create({
  option: {
    padding: '8px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
    borderTopWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderRightWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderBottomWidth: { default: null, ':hover': { default: null, [forcedColors]: '1px' } },
    borderLeftWidth: { default: '2px', ':hover': { default: null, [forcedColors]: '1px' } },
    borderTopStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderRightStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderBottomStyle: { default: null, ':hover': { default: null, [forcedColors]: 'solid' } },
    borderLeftStyle: 'solid',
    borderTopColor: {
      default: null,
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
    borderRightColor: {
      default: null,
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
    borderBottomColor: {
      default: null,
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
    borderLeftColor: {
      default: 'transparent',
      ':hover': { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    },
  },
  optionFocused: {
    backgroundColor: { default: colors['--gf-colors-action-focus'], ':hover': colors['--gf-colors-action-hover'] },
    borderTopWidth: { default: null, [forcedColors]: '1px' },
    borderRightWidth: { default: null, [forcedColors]: '1px' },
    borderBottomWidth: { default: null, [forcedColors]: '1px' },
    borderLeftWidth: { default: '2px', [forcedColors]: '1px' },
    borderTopStyle: { default: null, [forcedColors]: 'solid' },
    borderRightStyle: { default: null, [forcedColors]: 'solid' },
    borderBottomStyle: { default: null, [forcedColors]: 'solid' },
    borderTopColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    borderRightColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    borderBottomColor: { default: null, [forcedColors]: colors['--gf-colors-primary-border'] },
    borderLeftColor: { default: 'transparent', [forcedColors]: colors['--gf-colors-primary-border'] },
  },
  optionBody: {
    display: 'flex',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    flexDirection: 'column',
    flexGrow: 1,
  },
  optionDescription: {
    fontWeight: 'normal',
    fontSize: typography['--gf-typography-size-sm'],
    color: colors['--gf-colors-text-secondary'],
    whiteSpace: 'normal',
    lineHeight: typography['--gf-typography-body-line-height'],
  },
  menuOptionCheckbox: {
    display: 'flex',
    marginTop: 0,
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginBottom: 0,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
  },
  menuOptionBody: {
    fontWeight: typography['--gf-typography-font-weight-regular'],
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  menuOptionDisabled: {
    color: colors['--gf-colors-text-disabled'],
    cursor: 'not-allowed',
  },
});

export const sectionStyles = stylex.create({
  menuSection: {
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
  },
  groupHeader: {
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 4.5)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 4.5)`,
    display: 'flex',
    alignItems: 'center',
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
});
