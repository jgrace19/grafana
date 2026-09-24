import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const vizLayoutStyles = stylex.create({
  viz: {
    flexGrow: 2,
          borderRadius: cssVar('shape.radius.default'),
          ':focus-visible': { outline: '2px dotted transparent', outlineOffset: '2px', boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}` },
  },
});

export function vizLayoutStyleProps(key: keyof typeof vizLayoutStyles) {
  return stylex.props(vizLayoutStyles[key]);
}
