import * as stylex from '@stylexjs/stylex';

import { colors } from '@grafana/ui/stylex/tokens.stylex';

export const badgeColorStyles = stylex.create({
  badge: {
    backgroundColor: colors['--gf-colors-background-primary'],
    backgroundImage: 'none',
    borderColor: colors['--gf-colors-border-strong'],
    color: colors['--gf-colors-text-secondary'],
  },
});
