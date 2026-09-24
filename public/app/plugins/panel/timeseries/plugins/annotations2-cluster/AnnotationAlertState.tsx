import * as stylex from '@stylexjs/stylex';

import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import alertDef from 'app/features/alerting/state/alertDef';

interface Props {
  alertState: string | undefined;
}

export const AnnotationAlertState = ({ alertState }: Props) => {
  if (!alertState) {
    return null;
  }

  const stateModel = alertDef.getStateDisplayModel(alertState);
  return (
    <div {...stylex.props(styles.alertState)}>
      <i className={stateModel.stateClass}>{stateModel.text}</i>
    </div>
  );
};

const styles = stylex.create({
  alertState: {
    paddingRight: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
});
