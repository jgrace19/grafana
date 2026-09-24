import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

export const emailListConfigurationStyles = stylex.create({
  listField: {
    marginBottom: 0,
  },
  listContainer: {
    maxHeight: '140px',
        overflowY: 'auto',
  },
  table: {
    width: '100%',
  },
  listItem: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(0.5),
        padding: themeSpacingShorthand(0.75, 1),
        color: grafanaTokens.colors_text_secondary,
  },
  user: {
    flex: 1,
  },
  icon: {
    border: `${themeSpacing(0.25)} solid ${grafanaTokens.colors_text_secondary}`,
        padding: themeSpacingShorthand(0.125, 0.5),
        borderRadius: grafanaTokens.shape_radius_circle,
        color: grafanaTokens.colors_text_secondary,
  },
});
