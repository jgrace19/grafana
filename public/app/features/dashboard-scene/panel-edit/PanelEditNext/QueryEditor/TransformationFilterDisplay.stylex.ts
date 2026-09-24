import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const transformationFilterDisplayStyles = stylex.create({
  wrapper: {
    padding: themeSpacing(2),
        border: `2px solid ${grafanaTokens.colors_background_secondary}`,
        borderRadius: grafanaTokens.shape_radius_default,
        marginBottom: themeSpacing(2),
  },
  field: {
    display: 'flex',
        flexDirection: 'column',
        gap: themeSpacing(1),
  },
});
