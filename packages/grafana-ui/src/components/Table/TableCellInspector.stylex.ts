import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const tableCellInspectorStyles = stylex.create({
  textContainer: {
    color: cssVar('colors.text.secondary'),
        minHeight: 42,
  },
});

export function tableCellInspectorStyleProps(key: keyof typeof tableCellInspectorStyles) {
  return stylex.props(tableCellInspectorStyles[key]);
}
