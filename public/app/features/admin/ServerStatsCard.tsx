import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Card, Icon, Stack, Tooltip } from '@grafana/ui';
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
  return (
    <Card noMargin style={containerStyle}>
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

// Card has no xstyle; an inline style wins over its grid layout and padding, like the old className did.
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--gf-spacing-x2)',
  padding: 'var(--gf-spacing-x2)',
} as const;

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
