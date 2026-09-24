import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { storedNotificationItemStyles } from './StoredNotificationItem.stylex';
import { formatDistanceToNow } from 'date-fns';
import { type ReactNode } from 'react';

import { t } from '@grafana/i18n';
import { Card, Checkbox, useTheme2 } from '@grafana/ui';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface Props {
  children?: ReactNode;
  className?: string;
  isSelected: boolean;
  onClick: () => void;
  severity?: AlertVariant;
  title: string;
  timestamp?: number;
  traceId?: string;
}

export const StoredNotificationItem = ({
  children,
  className,
  isSelected,
  onClick,
  severity = 'error',
  title,
  traceId,
  timestamp,
}: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <Card noMargin className={className}>
      <Card.Heading>{title}</Card.Heading>
      <Card.Description>{children}</Card.Description>
      <Card.Figure>
        <Checkbox
          onChange={onClick}
          value={isSelected}
          aria-label={t('notifications.select-notification', 'Select {{title}}', { title })}
        />
      </Card.Figure>
      <Card.Tags {...stylex.props(storedNotificationItemStyles.trace)}>
        {traceId && <span>{`Trace ID: ${traceId}`}</span>}
        {timestamp && formatDistanceToNow(timestamp, { addSuffix: true })}
      </Card.Tags>
    </Card>
  );
};

