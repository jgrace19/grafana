import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const pageInfoStyles = stylex.create({
  container: {
    display: 'flex',
          flexDirection: 'row',
          gap: themeSpacing(1.5),
          overflow: 'auto',
  },
  infoItem: {
    .../* UNMAPPED theme.typography.bodySmall */ 'inherit',
          display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(0.5),
  },
  label: {
    color: grafanaTokens.colors_text_secondary,
  },
  separator: {
    borderLeft: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
});
