import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { appNotificationItemStyles } from './AppNotificationItem.stylex';
import { useEffectOnce } from 'react-use';

import { Trans } from '@grafana/i18n';
import { Alert } from '@grafana/ui';
import { type AppNotification, timeoutMap } from 'app/types/appNotifications';

interface Props {
  appNotification: AppNotification;
  onClearNotification: (id: string) => void;
}

export default function AppNotificationItem({ appNotification, onClearNotification }: Props) {

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
        <div {...stylex.props(appNotificationItemStyles.wrapper)}>
          <span>{appNotification.component || appNotification.text}</span>
          {traceId && (
            <span {...stylex.props(appNotificationItemStyles.trace)}>
              <Trans i18nKey="app-notification.item.trace-id">Trace ID: {{ traceId }}</Trans>
            </span>
          )}
        </div>
      )}
    </Alert>
  );
}

