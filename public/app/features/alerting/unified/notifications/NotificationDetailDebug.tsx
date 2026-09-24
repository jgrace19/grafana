import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { type CreateNotificationqueryNotificationEntry } from '@grafana/api-clients/rtkq/historian.alerting/v0alpha1';
import { dateTimeFormat } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Collapse, Text } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
      <div {...stylex.props(styles.detailsGrid)}>
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
          value={<code {...stylex.props(styles.groupKey)}>{notification.groupKey}</code>}
        />
      </div>
    </Collapse>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <div {...stylex.props(styles.detailLabel)}>
        <Text color="secondary" variant="bodySmall">
          {label}
        </Text>
      </div>
      <div {...stylex.props(styles.detailValue)}>{typeof value === 'string' ? <Text>{value}</Text> : value}</div>
    </>
  );
}

const styles = stylex.create({
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    rowGap: spacing['--gf-spacing-x1'],
    columnGap: spacing['--gf-spacing-x2'],
    alignItems: 'start',
  },
  detailLabel: {
    paddingTop: '2px',
  },
  detailValue: {
    wordBreak: 'break-all',
  },
  groupKey: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    backgroundColor: colors['--gf-colors-background-canvas'],
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    wordBreak: 'break-all',
  },
});
