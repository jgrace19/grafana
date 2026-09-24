import * as stylex from '@stylexjs/stylex';
import { formatDistanceToNow } from 'date-fns';
import { type ReactNode } from 'react';

import { t } from '@grafana/i18n';
import { Card, Checkbox } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

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
      <Card.Tags xstyle={styles.trace}>
        {traceId && <span>{`Trace ID: ${traceId}`}</span>}
        {timestamp && formatDistanceToNow(timestamp, { addSuffix: true })}
      </Card.Tags>
    </Card>
  );
};

const styles = stylex.create({
  trace: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    color: colors['--gf-colors-text-secondary'],
    display: 'flex',
    flexDirection: 'column',
    // theme.typography.pxToRem(10); bodySmall is pxToRem(12).
    fontSize: `calc(${typography['--gf-typography-body-small-font-size']} * 10 / 12)`,
    justifySelf: 'flex-end',
  },
});
