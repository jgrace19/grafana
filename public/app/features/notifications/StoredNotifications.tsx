import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import * as React from 'react';
import { useEffectOnce } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Alert, Button, Checkbox, EmptyState } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { StoredNotificationItem } from 'app/core/components/AppNotifications/StoredNotificationItem';
import {
  clearAllNotifications,
  clearNotification,
  readAllNotifications,
  selectWarningsAndErrors,
  selectLastReadTimestamp,
} from 'app/core/reducers/appNotification';
import { useDispatch, useSelector } from 'app/types/store';

export function StoredNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => selectWarningsAndErrors(state.appNotifications));
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);
  const allNotificationsSelected = notifications.every((notification) =>
    selectedNotificationIds.includes(notification.id)
  );
  const lastReadTimestamp = useRef(useSelector((state) => selectLastReadTimestamp(state.appNotifications)));

  useEffectOnce(() => {
    dispatch(readAllNotifications(Date.now()));
  });

  const clearSelectedNotifications = () => {
    if (allNotificationsSelected) {
      dispatch(clearAllNotifications());
    } else {
      selectedNotificationIds.forEach((id) => {
        dispatch(clearNotification(id));
      });
    }
    setSelectedNotificationIds([]);
  };

  const handleAllCheckboxToggle = (isChecked: boolean) => {
    setSelectedNotificationIds(isChecked ? notifications.map((n) => n.id) : []);
  };

  const handleCheckboxToggle = (id: string) => {
    setSelectedNotificationIds((prevState) => {
      if (!prevState.includes(id)) {
        return [...prevState, id];
      } else {
        return prevState.filter((notificationId) => notificationId !== id);
      }
    });
  };

  if (notifications.length === 0) {
    return (
      <EmptyState variant="completed" message={t('notifications.empty-state.title', "You're all caught up!")}>
        <Trans i18nKey="notifications.empty-state.description">Notifications you have received will appear here</Trans>
      </EmptyState>
    );
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Alert
        severity="info"
        title={t(
          'notifications.stored-notifications.title-alert',
          'This page displays past errors and warnings. Once dismissed, they cannot be retrieved.'
        )}
      />
      <div {...stylex.props(styles.topRow)}>
        <Checkbox
          value={allNotificationsSelected}
          aria-label={t('notifications.select-all', 'Select all notifications')}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleAllCheckboxToggle(event.target.checked)}
        />
        <Button disabled={selectedNotificationIds.length === 0} onClick={clearSelectedNotifications}>
          <Trans i18nKey="notifications.stored-notifications.dismiss-notifications">Dismiss notifications</Trans>
        </Button>
      </div>
      <ul {...stylex.props(styles.list)}>
        {notifications.map((notif) => (
          <li key={notif.id} {...stylex.props(styles.listItem)}>
            <StoredNotificationItem
              className={stylex.props(notif.timestamp > lastReadTimestamp.current && styles.newItem).className}
              isSelected={selectedNotificationIds.includes(notif.id)}
              onClick={() => handleCheckboxToggle(notif.id)}
              severity={notif.severity}
              title={notif.title}
              timestamp={notif.timestamp}
              traceId={notif.traceId}
            >
              <span>{notif.text}</span>
            </StoredNotificationItem>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = stylex.create({
  topRow: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
    listStyle: 'none',
    position: 'relative',
  },
  newItem: {
    '::before': {
      content: '""',
      height: '100%',
      position: 'absolute',
      left: '-7px',
      top: 0,
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      width: spacing['--gf-spacing-x0-5'],
      borderRadius: shape['--gf-shape-radius-default'],
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x2'],
  },
});
