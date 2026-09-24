import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '../../themes/stylex/tokens.stylex';

export function MenuDivider() {
  return <div {...stylex.props(styles.divider)} />;
}

const styles = stylex.create({
  divider: {
    height: 1,
    backgroundColor: colors['--gf-colors-border-weak'],
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
  },
});
