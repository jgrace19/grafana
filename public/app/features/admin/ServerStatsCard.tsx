import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { serverStatsCardStyles } from './ServerStatsCard.stylex';
import type { JSX } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Card, Icon, Stack, Tooltip } from '@grafana/ui';

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
    <Card noMargin {...stylex.props(serverStatsCardStyles.container)}>
      {content.map((item, index) => (
        <Stack key={index} justifyContent="space-between" alignItems="center">
          <Stack alignItems={'center'}>
            <span {...mergeStylexClassName(stylex.props(serverStatsCardStyles.indent, { []: !!item.indent }), undefined)}>{item.name}</span>
            {item.tooltip && (
              <Tooltip content={String(item.tooltip)} placement="auto-start">
                <Icon name="info-circle" {...stylex.props(serverStatsCardStyles.tooltip)} />
              </Tooltip>
            )}
          </Stack>
          {isLoading ? (
            <Skeleton width={60} />
          ) : (
            <span {...mergeStylexClassName(item.highlight  ? stylex.props(serverStatsCardStyles.highlight) : {}, undefined)}>{item.value}</span>
          )}
        </Stack>
      ))}
      {footer && <div>{footer}</div>}
    </Card>
  );
};

;
