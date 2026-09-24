import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { storedNotificationsStyles } from './StoredNotifications.stylex';
import { useRef, useState } from 'react';
import * as React from 'react';
import { useEffectOnce } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Alert, Button, Checkbox, EmptyState } from '@grafana/ui';
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
    <div {...stylex.props(storedNotificationsStyles.wrapper)}>
      <Alert
        severity="info"
        title={t(
          'notifications.stored-notifications.title-alert',
          'This page displays past errors and warnings. Once dismissed, they cannot be retrieved.'
        )}
      />
      <div {...stylex.props(storedNotificationsStyles.topRow)}>
        <Checkbox
          value={allNotificationsSelected}
          aria-label={t('notifications.select-all', 'Select all notifications')}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleAllCheckboxToggle(event.target.checked)}
        />
        <Button disabled={selectedNotificationIds.length === 0} onClick={clearSelectedNotifications}>
          <Trans i18nKey="notifications.stored-notifications.dismiss-notifications">Dismiss notifications</Trans>
        </Button>
      </div>
      <ul {...stylex.props(storedNotificationsStyles.list)}>
        {notifications.map((notif) => (
          <li key={notif.id} {...stylex.props(storedNotificationsStyles.listItem)}>
            <StoredNotificationItem
              {...mergeStylexClassName(stylex.props(storedNotificationsStyles.newItem, { []: notif.timestamp > lastReadTimestamp.current }), undefined)}
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

