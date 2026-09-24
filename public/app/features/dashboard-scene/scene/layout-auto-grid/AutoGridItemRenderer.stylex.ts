import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const autoGridItemRendererStyles = stylex.create({
  wrapper: {
    width: '100%', height: '100%', position: 'relative'
  },
  draggedWrapper: {
    position: 'absolute',
        zIndex: 1000,
        top: `var(${DRAGGED_ITEM_TOP})`,
        left: `var(${DRAGGED_ITEM_LEFT})`,
        width: `var(${DRAGGED_ITEM_WIDTH})`,
        height: `var(${DRAGGED_ITEM_HEIGHT})`,
        opacity: 0.8,
    
        // Unfortunately, we need to re-enforce the absolute position here. Otherwise, the position will be overwritten with
        //  a relative position by .dashboard-visible-hidden-element
        '&.dashboard-visible-hidden-element': {
          position: 'absolute',
        },
  },
  draggedRepeatWrapper: {
    visibility: 'hidden',
  },
  draggedPlaceholder: {
    width: '100%',
        height: '100%',
        boxShadow: `0 0 ${themeSpacing(0.5)} ${grafanaTokens.colors_primary_border}`,
        background: `${grafanaTokens.colors_primary_transparent}`,
        zIndex: -1,
  },
  hidden: {
    display: 'none',
  },
});
