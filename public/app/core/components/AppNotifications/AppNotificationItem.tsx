import * as stylex from '@stylexjs/stylex';
import { useEffectOnce } from 'react-use';

import { Trans } from '@grafana/i18n';
import { Alert, useTheme2 } from '@grafana/ui';
import { type AppNotification, timeoutMap } from 'app/types/appNotifications';

interface Props {
  appNotification: AppNotification;
  onClearNotification: (id: string) => void;
}

export default function AppNotificationItem({ appNotification, onClearNotification }: Props) {
  const theme = useTheme2();

  useEffectOnce(() => {
    setTimeout(() => {
      onClearNotification(appNotification.id);
    }, timeoutMap[appNotification.severity]);
  });

  const hasBody = appNotification.component || appNotification.text || appNotification.traceId;
  const traceId = appNotification.traceId;

  return (
    <Alert
      severity={appNotification.severity}
      title={appNotification.title}
      onRemove={() => onClearNotification(appNotification.id)}
      elevated
    >
      {hasBody && (
        <div {...stylex.props(styles.wrapper)}>
          <span>{appNotification.component || appNotification.text}</span>
          {traceId && (
            <span {...stylex.props(styles.fontSize(theme.typography.pxToRem(10)))}>
              <Trans i18nKey="app-notification.item.trace-id">Trace ID: {{ traceId }}</Trans>
            </span>
          )}
        </div>
      )}
    </Alert>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  fontSize: (fontSize: string) => ({ fontSize }),
});
