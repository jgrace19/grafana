import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const annotationAvatarStyles = stylex.create({
  avatar: {
    borderRadius: grafanaTokens.shape_radius_circle,
          width: themeSpacing(4),
          height: themeSpacing(4),
          marginRight: themeSpacing(1),
  },
});
