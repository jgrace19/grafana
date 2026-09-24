import * as stylex from '@stylexjs/stylex';
import { annotationAlertStateStyles } from './AnnotationAlertState.stylex';

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
    <div {...stylex.props(annotationAlertStateStyles.alertState)}>
      <i className={stateModel.stateClass}>{stateModel.text}</i>
    </div>
  );
};

