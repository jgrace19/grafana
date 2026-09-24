import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { instanceTimelineStyles } from './InstanceTimeline.stylex';
import React, { useMemo, useState } from 'react';

import {
  type CreateNotificationqueryNotificationEntry,
  type CreateNotificationqueryNotificationStatus,
} from '@grafana/api-clients/rtkq/historian.alerting/v0alpha1';
import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Icon, LinkButton, Stack, Text, Tooltip } from '@grafana/ui';
import { receiverTypeNames } from 'app/plugins/datasource/alertmanager/consts';
import { type GrafanaAlertStateWithReason } from 'app/types/unified-alerting-dto';

import { StateTag } from '../../components/StateTag';
import { EventState } from '../../components/rules/central-state-history/EventListSceneObject';
import { type LogRecord } from '../../components/rules/state-history/common';
import { INTEGRATION_ICONS } from '../../types/contact-points';
import { formatPrometheusDuration } from '../../utils/time';
import { createRelativeUrl } from '../../utils/url';

import { formatTimelineDate, noop } from './timelineUtils';

type NotificationEntry = CreateNotificationqueryNotificationEntry;

interface TimelineGroup {
  timestamp: number;
  type: 'state-change' | 'orphan-notifications';
  previous?: GrafanaAlertStateWithReason;
  current?: GrafanaAlertStateWithReason;
  notifications: NotificationEntry[];
}

/**
 * Groups notifications under the most recent preceding state change.
 *
 * Each notification is assigned to the latest state change whose timestamp is <= the notification's timestamp.
 * Notifications that predate all state changes are collected as "orphan" notifications.
 *
 * Note: state changes and notifications come from different sources, so minor clock skew
 * may cause a notification to be grouped with a slightly earlier or later state change.
 */
export function buildTimelineGroups(records: LogRecord[], notifications: NotificationEntry[]): TimelineGroup[] {
  const chronological = [...records].sort((a, b) => a.timestamp - b.timestamp);

  const stateGroups: TimelineGroup[] = chronological.map((record) => ({
    timestamp: record.timestamp,
    type: 'state-change',
    previous: record.line.previous,
    current: record.line.current,
    notifications: [],
  }));

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const orphanNotifications: NotificationEntry[] = [];

  for (const n of sortedNotifications) {
    const nTime = new Date(n.timestamp).getTime();

    let assignedIdx = -1;
    for (let i = stateGroups.length - 1; i >= 0; i--) {
      if (stateGroups[i].timestamp <= nTime) {
        assignedIdx = i;
        break;
      }
    }

    if (assignedIdx >= 0) {
      stateGroups[assignedIdx].notifications.push(n);
    } else {
      orphanNotifications.push(n);
    }
  }

  stateGroups.reverse();

  if (orphanNotifications.length > 0) {
    stateGroups.push({
      timestamp: new Date(orphanNotifications[0].timestamp).getTime(),
      type: 'orphan-notifications',
      notifications: orphanNotifications,
    });
  }

  return stateGroups;
}

interface TimelineEntry {
  timestamp: number;
  type: 'state-change' | 'notifications';
  previous?: GrafanaAlertStateWithReason;
  current?: GrafanaAlertStateWithReason;
  notifications?: NotificationEntry[];
}

export function buildTimelineEntries(groups: TimelineGroup[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const group of groups) {
    if (group.notifications.length > 0) {
      const lastNotification = group.notifications[group.notifications.length - 1];
      entries.push({
        timestamp: new Date(lastNotification.timestamp).getTime(),
        type: 'notifications',
        notifications: group.notifications,
      });
    }

    if (group.type === 'state-change' && group.previous && group.current) {
      entries.push({
        timestamp: group.timestamp,
        type: 'state-change',
        previous: group.previous,
        current: group.current,
      });
    }
  }

  return entries;
}

/**
 * Counts unique integrations that delivered successfully vs failed.
 *
 * An integration is identified by `integration:integrationIndex`. If any attempt
 * (including retries) for an integration succeeded, it counts as delivered.
 */
export function computeIntegrationOutcomes(notifications: NotificationEntry[]): {
  delivered: number;
  failed: number;
} {
  const best = new Map<string, boolean>();
  for (const n of notifications) {
    const key = `${n.integration}:${n.integrationIndex}`;
    if (n.outcome === 'success') {
      best.set(key, true);
    } else if (!best.has(key)) {
      best.set(key, false);
    }
  }
  let delivered = 0;
  let failed = 0;
  for (const success of best.values()) {
    if (success) {
      delivered++;
    } else {
      failed++;
    }
  }
  return { delivered, failed };
}

function EntryDot({ entry }: { entry: TimelineEntry }) {

  if (entry.type === 'state-change') {
    if (entry.current === 'Pending') {
      return <div className={cx(instanceTimelineStyles.dotBase, instanceTimelineStyles.dotPending)} />;
    }
    const isFiringTransition = entry.current === 'Alerting' || entry.current === 'NoData' || entry.current === 'Error';
    return <div className={cx(instanceTimelineStyles.dotBase, isFiringTransition ? instanceTimelineStyles.dotFiring : instanceTimelineStyles.dotResolved)} />;
  }

  if (!entry.notifications) {
    return <div className={cx(instanceTimelineStyles.dotBase, instanceTimelineStyles.dotDefault)} />;
  }

  const allFailed = entry.notifications.every((n) => n.outcome === 'error');
  const someFailed = entry.notifications.some((n) => n.outcome === 'error');

  if (allFailed) {
    return (
      <Tooltip content={t('alerting.instance-details.timeline-dot-all-failed', 'All notifications failed')}>
        <Icon name="exclamation-circle" size="sm" {...stylex.props(instanceTimelineStyles.dotIconError)} />
      </Tooltip>
    );
  }
  if (someFailed) {
    return (
      <Tooltip content={t('alerting.instance-details.timeline-dot-some-failed', 'Some notifications failed')}>
        <Icon name="exclamation-circle" size="sm" {...stylex.props(instanceTimelineStyles.dotIconError)} />
      </Tooltip>
    );
  }

  return <div className={cx(instanceTimelineStyles.dotBase, instanceTimelineStyles.dotDefault)} />;
}

export type TimelineFilter = 'all' | 'states' | 'notifications';

interface InstanceTimelineProps {
  records: LogRecord[];
  notifications: NotificationEntry[];
  filter?: TimelineFilter;
}

export function InstanceTimeline({ records, notifications, filter = 'all' }: InstanceTimelineProps) {

  const groups = useMemo(() => buildTimelineGroups(records, notifications), [records, notifications]);
  const allEntries = useMemo(() => buildTimelineEntries(groups), [groups]);

  const entries = useMemo(() => {
    if (filter === 'all') {
      return allEntries;
    }
    if (filter === 'states') {
      return allEntries.filter((e) => e.type === 'state-change');
    }
    return allEntries.filter((e) => e.type === 'notifications');
  }, [allEntries, filter]);

  if (allEntries.length === 0) {
    return (
      <Text color="secondary">
        {t('alerting.instance-details.timeline-empty', 'No events found for this time range')}
      </Text>
    );
  }

  return (
    <Stack direction="column" gap={1}>
      {entries.length === 0 ? (
        <Text color="secondary">
          {t('alerting.instance-details.timeline-filter-empty', 'No matching events for this filter')}
        </Text>
      ) : (
        <div {...stylex.props(instanceTimelineStyles.timelineGrid)}>
          {entries.map((entry, index) => (
            <React.Fragment key={`${entry.type}-${entry.timestamp}-${index}`}>
              <div {...stylex.props(instanceTimelineStyles.timestampCell)}>
                <Text variant="bodySmall" color="secondary">
                  {formatTimelineDate(entry.timestamp)}
                </Text>
              </div>
              <div {...stylex.props(instanceTimelineStyles.dotCell)}>
                <EntryDot entry={entry} />
              </div>
              <div {...stylex.props(instanceTimelineStyles.contentCell)}>
                {entry.type === 'notifications' && entry.notifications && (
                  <NotificationSummary notifications={entry.notifications} />
                )}
                {entry.type === 'state-change' && entry.previous && entry.current && (
                  <div {...stylex.props(instanceTimelineStyles.stateChangeRow)}>
                    <EventState state={entry.previous} showLabel addFilter={noop} type="from" />
                    <Icon name="arrow-right" size="sm" />
                    <EventState state={entry.current} showLabel addFilter={noop} type="to" />
                  </div>
                )}
              </div>
              {index < entries.length - 1 && (
                <>
                  <div />
                  <div {...stylex.props(instanceTimelineStyles.connectorCell)}>
                    <div {...stylex.props(instanceTimelineStyles.connectorLine)} />
                  </div>
                  <div />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </Stack>
  );
}

function NotificationSummary({ notifications }: { notifications: NotificationEntry[] }) {
  const byStatus = useMemo(() => {
    const grouped: Record<CreateNotificationqueryNotificationStatus, NotificationEntry[]> = {
      firing: [],
      resolved: [],
    };
    for (const n of notifications) {
      grouped[n.status].push(n);
    }
    return Object.entries(grouped).filter(
      (entry): entry is [CreateNotificationqueryNotificationStatus, NotificationEntry[]] => entry[1].length > 0
    );
  }, [notifications]);

  return (
    <Stack direction="column" gap={0.5}>
      {byStatus.map(([status, items]) => (
        <NotificationStatusGroup key={status} status={status} notifications={items} />
      ))}
    </Stack>
  );
}

function NotificationStatusGroup({
  status,
  notifications,
}: {
  status: CreateNotificationqueryNotificationStatus;
  notifications: NotificationEntry[];
}) {
  const [expanded, setExpanded] = useState(false);

  const integrationOutcomes = useMemo(() => computeIntegrationOutcomes(notifications), [notifications]);

  const { delivered: successCount, failed: failedCount } = integrationOutcomes;

  const uniqueReceivers = [...new Set(notifications.map((n) => n.receiver))];
  const receiverLabel =
    uniqueReceivers.length === 1
      ? uniqueReceivers[0]
      : t('alerting.instance-details.timeline-n-uniqueReceivers', '{{count}} uniqueReceivers', {
          count: uniqueReceivers.length,
        });

  let deliveryLabel: string | undefined;
  if (failedCount > 0 && successCount === 0) {
    deliveryLabel =
      failedCount === 1
        ? t('alerting.instance-details.timeline-all-failed', 'failed')
        : t('alerting.instance-details.timeline-all-failed-plural', 'all failed');
  } else if (failedCount > 0) {
    deliveryLabel = t(
      'alerting.instance-details.timeline-partial-failure',
      '{{successCount}} delivered, {{failedCount}} failed',
      { successCount, failedCount }
    );
  }

  const isFiring = status === 'firing';

  const statusLabel = isFiring
    ? t('alerting.instance-details.timeline-status-firing', 'Firing')
    : t('alerting.instance-details.timeline-status-resolved', 'Resolved');

  const variantStyle = isFiring ? instanceTimelineStyles.summaryRowFiring : instanceTimelineStyles.summaryRowResolved;

  return (
    <div>
      <button
        className={cx(instanceTimelineStyles.summaryRowBase, variantStyle)}
        onClick={() => setExpanded(!expanded)}
        type="button"
        aria-expanded={expanded}
        aria-label={t('alerting.instance-details.timeline-toggle-notifications', 'Toggle notification details')}
      >
        <Stack direction="row" alignItems="center" gap={0.5} wrap="wrap">
          <StateTag state={isFiring ? 'bad' : 'good'} size="sm">
            {statusLabel}{' '}
            <span {...stylex.props(instanceTimelineStyles.lowercaseText)}>
              {t('alerting.instance-details.timeline-notification-label', 'notification')}
            </span>
          </StateTag>
          {deliveryLabel && (
            <>
              <Text variant="bodySmall" color="secondary">
                ·
              </Text>
              <Icon name="exclamation-circle" size="sm" {...stylex.props(instanceTimelineStyles.errorIcon)} />
              <Text variant="bodySmall" color="error" weight="medium">
                {deliveryLabel}
              </Text>
            </>
          )}
          <Text variant="bodySmall" color="secondary">
            →
          </Text>
          <Icon name="at" size="sm" />
          {uniqueReceivers.length === 1 ? (
            <a
              href={textUtil.sanitizeUrl(
                createRelativeUrl(`/alerting/notifications?search=${encodeURIComponent(uniqueReceivers[0])}`)
              )}
              {...stylex.props(instanceTimelineStyles.receiverLink)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Text variant="bodySmall">{receiverLabel}</Text>
            </a>
          ) : (
            <Text variant="bodySmall" truncate>
              {receiverLabel}
            </Text>
          )}
        </Stack>
        <Icon name={expanded ? 'angle-up' : 'angle-down'} size="sm" />
      </button>

      {expanded && (
        <div {...stylex.props(instanceTimelineStyles.notificationDetails)}>
          {[...notifications].reverse().map((notification) => (
            <NotificationRow key={notification.uuid} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({ notification }: { notification: NotificationEntry }) {
  const isSuccess = notification.outcome === 'success';

  return (
    <div {...stylex.props(instanceTimelineStyles.notificationDetailRow)}>
      <div {...stylex.props(instanceTimelineStyles.notificationRowMain)}>
        <Text variant="bodySmall" color="secondary">
          {formatTimelineDate(notification.timestamp)}
        </Text>
        <Stack direction="row" gap={0.5} alignItems="center">
          <IntegrationIcon integration={notification.integration} />
          <Text variant="bodySmall" weight="medium">
            {receiverTypeNames[notification.integration] ?? notification.integration} #
            {notification.integrationIndex + 1}
          </Text>
        </Stack>
        {isSuccess && (
          <Stack direction="row" gap={0.5} alignItems="center">
            <Icon name="check-circle" size="sm" {...stylex.props(instanceTimelineStyles.successIcon)} />
            <Text variant="bodySmall" color="success">
              {t('alerting.instance-details.timeline-delivered', 'Delivered')}
            </Text>
          </Stack>
        )}
        <Text variant="bodySmall" color="secondary">
          {formatPrometheusDuration(Math.floor(notification.duration / 1_000_000))}
        </Text>
        {config.featureToggles.alertingNotificationHistoryDetail && (
          <Tooltip content={t('alerting.instance-details.view-notification-tooltip', 'View full notification details')}>
            <LinkButton
              variant="secondary"
              size="sm"
              icon="eye"
              href={createRelativeUrl(
                `/alerting/notifications-history/view/${notification.uuid}?ts=${new Date(notification.timestamp).getTime()}`
              )}
            >
              {t('alerting.instance-details.view-notification-detail', 'Details')}
            </LinkButton>
          </Tooltip>
        )}
      </div>
      {!isSuccess && (
        <div {...stylex.props(instanceTimelineStyles.notificationRowError)}>
          <Icon name="exclamation-circle" size="sm" {...stylex.props(instanceTimelineStyles.errorIcon)} />
          <Text variant="bodySmall" color="error" truncate={false}>
            {notification.error || t('alerting.instance-details.timeline-failed', 'Failed')}
          </Text>
        </div>
      )}
    </div>
  );
}

function IntegrationIcon({ integration }: { integration: string }) {
  return <Icon name={INTEGRATION_ICONS[integration] || 'bell'} size="sm" />;
}

