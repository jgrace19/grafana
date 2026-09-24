import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { Alert, type AlertVariant } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { temporaryAlertStyles } from './TemporaryAlert.stylex';

enum AlertTimeout {
  Error = 7000,
  Info = 3000,
  Success = 3000,
  Warning = 5000,
}

const timeoutMap = {
  ['error']: AlertTimeout.Error,
  ['info']: AlertTimeout.Info,
  ['success']: AlertTimeout.Success,
  ['warning']: AlertTimeout.Warning,
};

type AlertProps = {
  severity: AlertVariant;
  text: string;
};

export const TemporaryAlert = (props: AlertProps) => {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  useEffect(() => {
    if (props.text !== '') {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, timeoutMap[props.severity]);
      setTimer(timer);
    }
  }, [props.severity, props.text]);

  return (
    <>
      {visible && (
        <Alert
          className={mergeStylexClassName(stylex.props(temporaryAlertStyles.alert)).className}
          elevated={true}
          onRemove={() => setVisible(false)}
          severity={props.severity}
          title={props.text}
        />
      )}
    </>
  );
};
