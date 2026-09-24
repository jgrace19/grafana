import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../themes/stylex/cssVar';
import { focusStyles } from '../../themes/stylex/mixins.stylex';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const tabStyles = stylex.create({
  clearButton: {
    background: 'transparent',
    color: cssVar('colors.text.primary'),
    border: 'none',
    padding: 0,
  },
  item: {
    listStyle: 'none',
    position: 'relative',
    display: 'flex',
    whiteSpace: 'nowrap',
    padding: cssVarSpacing(0, 0.5),
  },
  itemTruncate: { maxWidth: '320px' },
  link: {
    color: cssVar('colors.text.secondary'),
    padding: cssVarSpacing(1, 1.5, 1),
    borderRadius: cssVar('shape.radius.default'),
    display: 'block',
    height: '100%',
    position: 'relative',
    ' svg': { marginRight: spacingToken(1) },
    ':focus-visible': focusStyles.focus,
    '::before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      borderRadius: cssVar('shape.radius.default'),
      bottom: 0,
    },
  },
  linkTruncate: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordBreak: 'break-word',
    overflow: 'hidden',
  },
  notActive: {
    ':hover': {
      color: cssVar('colors.text.primary'),
      '::before': { backgroundColor: cssVar('colors.action.hover') },
    },
    ':focus': {
      color: cssVar('colors.text.primary'),
      '::before': { backgroundColor: cssVar('colors.action.hover') },
    },
  },
  activeStyle: {
    label: 'activeTabStyle',
    color: cssVar('colors.text.primary'),
    overflow: 'hidden',
    '::before': { backgroundImage: cssVar('colors.gradients.brandHorizontal') },
  },
  suffix: { marginLeft: spacingToken(1) },
  disabled: {
    color: cssVar('colors.text.disabled'),
    cursor: 'not-allowed',
    ':hover': {
      color: cssVar('colors.text.disabled'),
      '::before': { backgroundColor: 'transparent' },
    },
    ':focus': {
      color: cssVar('colors.text.disabled'),
      '::before': { backgroundColor: 'transparent' },
    },
  },
});

export function tabStyleProps(key: keyof typeof tabStyles) {
  return stylex.props(tabStyles[key]);
}
