import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { grafanaTokens } from '../../themes/stylex/tokens.generated.stylex';
import { spacingToken } from '../../themes/stylex/spacingTokens';

export const badgeStyles = stylex.create({
  wrapper: {
    display: 'inline-flex',
    padding: '1px 4px',
    borderRadius: grafanaTokens.shape_radius_sm,
    background: 'var(--grafana-badge-bg)',
    border: '1px solid var(--grafana-badge-border)',
    color: 'var(--grafana-badge-text)',
    fontWeight: grafanaTokens.typography_fontWeightRegular,
    gap: spacingToken(0.5),
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
    alignItems: 'center',
  },
  brand: {
    background: cssVar('colors.gradients.brandHorizontal'),
    borderColor: 'transparent',
    color: cssVar('colors.primary.contrastText'),
  },
  skeletonContainer: { lineHeight: 1 },
});
