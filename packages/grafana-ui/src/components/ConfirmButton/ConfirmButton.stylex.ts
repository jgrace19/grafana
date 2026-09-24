import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';

export const confirmButtonStyles = stylex.create({
  container: {
    alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
  },
  mainButton: {
    opacity: 1,
          '@media (prefers-reduced-motion: no-preference)': {
            transitionProperty: ['opacity'], transitionDuration: cssVar('transitions.duration.short'),
          },
          zIndex: 2,
  },
  mainButtonHide: {
    opacity: 0,
          '@media (prefers-reduced-motion: no-preference)': {
            transitionProperty: ['opacity', 'visibility'], transitionDuration: cssVar('transitions.duration.short'),
          },
          visibility: 'hidden',
          zIndex: 0,
  },
  confirmButtonContainer: {
    overflow: 'visible',
          position: 'absolute',
          pointerEvents: 'all',
          right: 0,
  },
  confirmButtonContainerHide: {
    overflow: 'hidden',
          pointerEvents: 'none',
  },
  confirmButton: {
    alignItems: 'flex-start',
          background: cssVar('colors.background.primary'),
          display: 'flex',
          opacity: 1,
          transform: 'translateX(0)',
          '@media (prefers-reduced-motion: no-preference)': {
            transitionProperty: ['opacity', 'transform'], transitionDuration: cssVar('transitions.duration.short'),
          },
          zIndex: 1,
  },
  confirmButtonHide: {
    opacity: 0,
          transform: 'translateX(100%)',
          '@media (prefers-reduced-motion: no-preference)': {
            transitionProperty: ['opacity', 'transform', 'visibility'], transitionDuration: cssVar('transitions.duration.short'),
          },
          visibility: 'hidden',
  },
});

export function confirmButtonStyleProps(key: keyof typeof confirmButtonStyles) {
  return stylex.props(confirmButtonStyles[key]);
}
