import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const tagBadgeStyles = stylex.create({
  badge: {
    .../* UNMAPPED theme.typography.bodySmall */ 'inherit',
        backgroundColor: theme.v1.palette.gray1,
        borderRadius: grafanaTokens.shape_radius_sm,
        color: theme.v1.palette.white,
        display: 'inline-block',
        height: '20px',
        lineHeight: '20px',
        padding: themeSpacingShorthand(0, 0.75),
        verticalAlign: 'baseline',
        whiteSpace: 'nowrap',
        ':hover': {
          opacity: 0.85,
        },
  },
});
