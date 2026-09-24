import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { MENU_WIDTH } from './MegaMenu/MegaMenu';

const motionMedia = '@media (prefers-reduced-motion: no-preference)';
const mdUp = '@media (min-width: 769px)';
const mdDown = '@media (max-width: 768.95px)';

const overlayTransition = {
  [motionMedia]: {
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
  },
  [mdDown]: {
    overflow: 'hidden',
  },
};

export const appChromeMenuTransitionStyles = stylex.create({
  backdropEnter: {
    opacity: 0,
  },
  backdropEnterActive: {
    ...overlayTransition,
    transitionProperty: 'opacity',
    opacity: 1,
  },
  backdropEnterDone: {
    opacity: 1,
  },
  overlayEnter: {
    boxShadow: 'none',
    width: 0,
  },
  overlayEnterActive: {
    ...overlayTransition,
    transitionProperty: 'box-shadow, width',
    width: '100%',
    '.scrollbar-view': {
      overflow: 'hidden !important',
    },
    [mdUp]: {
      borderRight: `1px solid ${grafanaTokens.colors_border_weak}`,
      boxShadow: grafanaTokens.shadows_z3,
      width: MENU_WIDTH,
    },
  },
  overlayEnterDone: {
    width: '100%',
    [mdUp]: {
      borderRight: `1px solid ${grafanaTokens.colors_border_weak}`,
      boxShadow: grafanaTokens.shadows_z3,
      width: MENU_WIDTH,
    },
  },
});
