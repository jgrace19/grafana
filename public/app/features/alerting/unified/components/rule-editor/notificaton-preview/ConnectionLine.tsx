import * as stylex from '@stylexjs/stylex';

import { Box } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

export function ConnectionLine() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height={4}>
      <div {...stylex.props(styles.line)} />
    </Box>
  );
}

const styles = stylex.create({
  line: {
    width: '1px',
    height: '100%',
    backgroundColor: colors['--gf-colors-border-medium'],
  },
});
