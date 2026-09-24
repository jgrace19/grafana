import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const editorColumnHeaderStyles = stylex.create({
  container: {
    display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: themeSpacingShorthand(1, 2),
        backgroundColor: grafanaTokens.colors_background_secondary,
        border: `1px solid ${grafanaTokens.colors_border_medium}`,
        borderTopLeftRadius: grafanaTokens.shape_radius_default,
        borderTopRightRadius: grafanaTokens.shape_radius_default,
  },
  label: {
    margin: 0,
  },
});
