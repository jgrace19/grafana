import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export function ProgressBar({ stepsDone, totalStepsToDo }: { stepsDone: number; totalStepsToDo: number }) {
  if (totalStepsToDo === 0) {
    return null;
  }
  return (
    <div
      {...stylex.props(styles.containerStyles)}
      role="progressbar"
      aria-valuenow={stepsDone}
      aria-valuemax={totalStepsToDo}
    >
      <div {...stylex.props(styles.fillerStyles, styles.fillerWidth(`${(stepsDone / totalStepsToDo) * 100}%`))} />
    </div>
  );
}
export function StepsStatus({ stepsDone, totalStepsToDo }: { stepsDone: number; totalStepsToDo: number }) {
  return (
    <span>
      <Trans i18nKey="gops.progress-bar.steps-status" values={{ stepsDone }}>
        <Text color="success">{'{{stepsDone}}'}</Text> of {{ totalStepsToDo }}
      </Trans>
    </span>
  );
}

const styles = stylex.create({
  containerStyles: {
    height: spacing['--gf-spacing-x2'],
    borderRadius: shape['--gf-shape-radius-pill'],
    backgroundColor: colors['--gf-colors-border-weak'],
    flex: 'auto',
  },
  fillerStyles: {
    height: '100%',
    backgroundColor: colors['--gf-colors-success-main'],
    borderRadius: shape['--gf-shape-radius-pill'],
    textAlign: 'right',
  },
  fillerWidth: (width: string) => ({
    width,
  }),
});
