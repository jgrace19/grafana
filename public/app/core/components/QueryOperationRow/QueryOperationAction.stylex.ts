import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryOperationActionStyles = stylex.create({
  icon: {
    display: 'flex',
          position: 'relative',
          color: grafanaTokens.colors_text_secondary,
  },
  active: {
    '&:before': {
            display: 'block',
            content: '" "',
            position: 'absolute',
            left: -1,
            right: 2,
            height: 3,
            borderRadius: grafanaTokens.shape_radius_default,
            bottom: -8,
            backgroundImage: grafanaTokens.colors_gradients_brandHorizontal,
          },
  },
});
