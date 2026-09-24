
import { Trans } from '@grafana/i18n';
import { Text, } from '@grafana/ui';

export function ProgressBar({ stepsDone, totalStepsToDo }: { stepsDone: number; totalStepsToDo: number }) {
  const styles = (getStyles);
  if (totalStepsToDo === 0) {
    return null;
  }
  return (
    <div {...stylex.props(progressBarStyles.containerStyles)} role="progressbar" aria-valuenow={stepsDone} aria-valuemax={totalStepsToDo}>
      <div className={styles.fillerStyles((stepsDone / totalStepsToDo) * 100)} />
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

