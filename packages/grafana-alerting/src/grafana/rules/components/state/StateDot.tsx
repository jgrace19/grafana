import * as stylex from '@stylexjs/stylex';

import { Stack } from '@grafana/ui';

import { stateDotStyles } from '../alertingRules.stylex';

interface DotStylesProps {
  color: 'success' | 'error' | 'warning' | 'unknown' | 'info';
}

const StateDot = ({ color }: DotStylesProps) => {
  const variant =
    color === 'success'
      ? stateDotStyles.success
      : color === 'warning'
        ? stateDotStyles.warning
        : color === 'error'
          ? stateDotStyles.error
          : color === 'info'
            ? stateDotStyles.info
            : undefined;

  return (
    <Stack direction="row" gap={0.5}>
      <div {...stylex.props(stateDotStyles.dot, variant)} />
    </Stack>
  );
};

export { StateDot };
