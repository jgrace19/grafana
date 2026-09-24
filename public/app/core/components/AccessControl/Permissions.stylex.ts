import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const permissionsStyles = stylex.create({
  breakdown: {
    .../* UNMAPPED theme.typography.bodySmall */ 'inherit',
        color: grafanaTokens.colors_text_secondary,
        marginBottom: themeSpacing(2),
  },
  addPermissionButton: {
    marginBottom: themeSpacing(2),
  },
});
