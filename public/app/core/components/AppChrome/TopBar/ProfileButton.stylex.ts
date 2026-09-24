import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const profileButtonStyles = stylex.create({
  profileButton: {
    padding: themeSpacingShorthand(0, 0.5),
          img: {
            borderRadius: grafanaTokens.shape_radius_circle,
            height: '24px',
            marginRight: 0,
            width: '24px',
          },
  },
});
