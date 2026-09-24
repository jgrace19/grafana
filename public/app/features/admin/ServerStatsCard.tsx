import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';
import Skeleton from 'react-loading-skeleton';

import { type GrafanaTheme2 } from '@grafana/data';
import { Card, Icon, Stack, Tooltip, useStyles2 } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

interface StatItem {
  name: string;
  value: string | number | undefined;
  tooltip?: string;
  highlight?: boolean;
  indent?: boolean;
}

export interface Props {
  content: StatItem[];
  isLoading?: boolean;
  footer?: JSX.Element | boolean;
}

export const ServerStatsCard = ({ content, footer, isLoading }: Props) => {
  const pendingStyles = useStyles2(getPendingStyles);
  return (
    <Card noMargin className={pendingStyles.container}>
      {content.map((item, index) => (
        <Stack key={index} justifyContent="space-between" alignItems="center">
          <Stack alignItems={'center'}>
            <span {...stylex.props(!!item.indent && styles.indent)}>{item.name}</span>
            {item.tooltip && (
              <Tooltip content={String(item.tooltip)} placement="auto-start">
                <Icon name="info-circle" xstyle={styles.tooltip} />
              </Tooltip>
            )}
          </Stack>
          {isLoading ? (
            <Skeleton width={60} />
          ) : (
            <span {...stylex.props(item.highlight && styles.highlight)}>{item.value}</span>
          )}
        </Stack>
      ))}
      {footer && <div>{footer}</div>}
    </Card>
  );
};

// stylex: pending Card migration
const getPendingStyles = (theme: GrafanaTheme2) => ({
  container: css({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  }),
});

const styles = stylex.create({
  indent: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
  tooltip: {
    color: colors['--gf-colors-secondary-text'],
  },
  highlight: {
    color: colors['--gf-colors-warning-text'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    marginRight: `calc(-1 * ${spacing['--gf-spacing-x1']})`,
  },
});
