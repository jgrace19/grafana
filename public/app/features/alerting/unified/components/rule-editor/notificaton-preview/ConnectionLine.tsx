import * as stylex from '@stylexjs/stylex';

import { Box } from '@grafana/ui';

export function ConnectionLine() {

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height={4}>
      <div {...stylex.props(connectionLineStyles.line)} />
    </Box>
  );
}

