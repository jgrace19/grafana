import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const dataLinkSuggestionsStyles = stylex.create({
  list: {
    borderBottom: `1px solid ${cssVar('colors.border.weak')}`,
          ':last-child': {
            border: 'none',
          },
  },
  wrapper: {
    background: cssVar('colors.background.primary'),
          width: '250px',
  },
  item: {
    background: 'none',
          padding: '2px 8px',
          userSelect: 'none',
          color: cssVar('colors.text.primary'),
          cursor: 'pointer',
          ':hover': {
            background: cssVar('colors.action.hover'),
          },
  },
  label: {
    color: cssVar('colors.text.secondary'),
  },
  activeItem: {
    background: cssVar('colors.background.secondary'),
          ':hover': {
            background: cssVar('colors.background.secondary'),
          },
  },
  itemValue: {
    fontFamily: cssVar('typography.fontFamilyMonospace'),
          fontSize: cssVar('typography.size.sm'),
  },
});

export function dataLinkSuggestionsStyleProps(key: keyof typeof dataLinkSuggestionsStyles) {
  return stylex.props(dataLinkSuggestionsStyles[key]);
}
