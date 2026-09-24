import * as stylex from '@stylexjs/stylex';
import { queryOptionGroupStyles } from './QueryOptionGroup.stylex';

import * as React from 'react';
import { useToggle } from 'react-use';

import { getValueFormat, type GrafanaTheme2 } from '@grafana/data';
import { config } from '@grafana/runtime';
import { Collapse, Icon, Tooltip, Stack } from '@grafana/ui';

import { type QueryStats } from '../loki/types';

export interface Props {
  title: string;
  collapsedInfo: string[];
  queryStats?: QueryStats | null;
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

export function QueryOptionGroup({ title, children, collapsedInfo, queryStats, onToggle, isOpen: propsIsOpen }: Props) {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div {...stylex.props(queryOptionGroupStyles.wrapper)}>
      <Collapse
        {...stylex.props(queryOptionGroupStyles.collapse)}
        isOpen={propsIsOpen ?? isOpen}
        onToggle={onToggle ?? toggleOpen}
        label={
          <Stack gap={0}>
            <h6 {...stylex.props(queryOptionGroupStyles.title)}>{title}</h6>
            {!isOpen && (
              <div {...stylex.props(queryOptionGroupStyles.description)}>
                {collapsedInfo.map((x, i) => (
                  <span key={i}>{x}</span>
                ))}
              </div>
            )}
          </Stack>
        }
      >
        <div {...stylex.props(queryOptionGroupStyles.body)}>{children}</div>
      </Collapse>

      {queryStats && config.featureToggles.lokiQuerySplitting && (
        <Tooltip content="Note: the query will be split into multiple parts and executed in sequence. Query limits will only apply each individual part.">
          <Icon tabIndex={0} name="info-circle" {...stylex.props(queryOptionGroupStyles.tooltip)} size="sm" />
        </Tooltip>
      )}

      {queryStats && <p {...stylex.props(queryOptionGroupStyles.stats)}>{generateQueryStats(queryStats)}</p>}
    </div>
  );
}

;

const generateQueryStats = (queryStats: QueryStats) => {
  if (queryStats.message) {
    return queryStats.message;
  }

  return `This query will process approximately ${convertUnits(queryStats)}.`;
};

const convertUnits = (queryStats: QueryStats): string => {
  const { text, suffix } = getValueFormat('bytes')(queryStats.bytes, 1);
  return text + suffix;
};
