import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../../../core/stylex/spacing';

import { CONTENT_SIDE_BAR } from '../../constants';

export const queryEditorBodyStyles = stylex.create({
  container: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    display: 'flex',
  },
  scrollableContent: {
    flex: 1,
    minWidth: 0,
    overflow: 'auto',
    padding: themeSpacing(2),
    ['@media (prefers-reduced-motion: no-preference)']: {
      transitionProperty: 'filter',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in-out',
    },
  },
  scrollableContentBlurred: {
    filter: 'blur(10px)',
    pointerEvents: 'none',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: CONTENT_SIDE_BAR.width,
    zIndex: grafanaTokens.zIndex_sidemenu,
  },
  enter: {
    transform: 'translateX(-100%)',
  },
  enterActive: {
    transform: 'translateX(0)',
  },
  exit: {
    transform: 'translateX(0)',
  },
  exitActive: {
    transform: 'translateX(-100%)',
  },
});
