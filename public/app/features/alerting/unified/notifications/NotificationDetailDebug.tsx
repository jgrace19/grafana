import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { notificationDetailDebugStyles } from './NotificationDetailDebug.stylex';
import { type ReactNode } from 'react';

import { type CreateNotificationqueryNotificationEntry } from '@grafana/api-clients/rtkq/historian.alerting/v0alpha1';
import { t } from '@grafana/i18n';
import { Collapse, Text } from '@grafana/ui';

type NotificationEntry = CreateNotificationqueryNotificationEntry;

interface DebugDetailsProps {
  notification: NotificationEntry;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function DebugDetails({ notification, isOpen, onToggle }: DebugDetailsProps) {

  return (
    <Collapse
      label={t('alerting.notification-detail.debug-details-heading', 'Debug details')}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div {...stylex.props(notificationDetailDebugStyles.detailsGrid)}>
        <DetailRow label={t('alerting.notification-detail.field-uuid', 'UUID')} value={notification.uuid} />
        <DetailRow
          label={t('alerting.notification-detail.field-timestamp', 'Timestamp')}
          value={dateTimeFormat(notification.timestamp)}
        />
        <DetailRow
          label={t('alerting.notification-detail.field-pipeline-time', 'Pipeline time')}
          value={dateTimeFormat(notification.pipelineTime)}
        />
        <DetailRow
          label={t('alerting.notification-detail.field-integration-index', 'Integration index')}
          value={String(notification.integrationIndex)}
        />
        <DetailRow
          label={t('alerting.notification-detail.field-retry', 'Retry')}
          value={
            notification.retry
              ? t('alerting.notification-detail.yes', 'Yes')
              : t('alerting.notification-detail.no', 'No')
          }
        />
        <DetailRow
          label={t('alerting.notification-detail.field-group-key', 'Group key')}
          value={<code {...stylex.props(notificationDetailDebugStyles.groupKey)}>{notification.groupKey}</code>}
        />
      </div>
    </Collapse>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <div {...stylex.props(notificationDetailDebugStyles.detailLabel)}>
        <Text color="secondary" variant="bodySmall">
          {label}
        </Text>
      </div>
      <div {...stylex.props(notificationDetailDebugStyles.detailValue)}>{typeof value === 'string' ? <Text>{value}</Text> : value}</div>
    </>
  );
}

