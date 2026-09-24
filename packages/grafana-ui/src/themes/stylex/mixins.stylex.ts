import * as stylex from '@stylexjs/stylex';

import { cssVar } from './cssVar';

export const focusStyles = stylex.create({
  focus: {
    outline: '2px dotted transparent',
    outlineOffset: '2px',
    boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}`,
    transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
    transitionDuration: '0.2s',
    transitionProperty: 'outline, outline-offset, box-shadow',
  },
  focusVisibleAfter: {
    outline: 'none',
    outlineOffset: 0,
    boxShadow: 'none',
  },
});

export const focusAfterPseudo = stylex.create({
  after: {
    position: 'absolute',
    content: '""',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: cssVar('shape.radius.default'),
    zIndex: 1,
    outline: '2px dotted transparent',
    outlineOffset: '2px',
    boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}`,
    transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
    transitionDuration: '0.2s',
    transitionProperty: 'outline, outline-offset, box-shadow',
  },
});
