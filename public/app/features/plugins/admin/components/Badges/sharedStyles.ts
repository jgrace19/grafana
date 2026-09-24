import { type CSSProperties } from 'react';

import { colors } from '@grafana/ui/stylex/tokens.stylex';

// Badge is StyleX and sets these colours itself; StyleX only resolves conflicts within a single stylex.props()
// call, so the override goes through Badge's inline `style` instead of a class.
export const badgeColorStyle: CSSProperties = {
  background: colors['--gf-colors-background-primary'],
  borderColor: colors['--gf-colors-border-strong'],
  color: colors['--gf-colors-text-secondary'],
};
