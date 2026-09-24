import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { groupRowStyles } from './GroupRow.stylex';
import React from 'react';

import { AlertLabel } from '@grafana/alerting/unstable';
import { t } from '@grafana/i18n';
import { Text } from '@grafana/ui';

import { EmptyLabelValue, type GenericGroupedRow } from '../types';

import { GenericRow } from './GenericRow';
import { RowActions } from './InstanceCountBadges';
import { formatLabelValue } from './utils';

interface GroupRowProps {
  row: GenericGroupedRow;
  leftColumnWidth: number;
  rowKey: React.Key;
  depth?: number;
  children?: React.ReactNode;
}

export const GroupRow = ({ row, leftColumnWidth, rowKey, depth = 0, children }: GroupRowProps) => {
  const isEmptyValue = row.metadata.value === EmptyLabelValue;

  return (
    <GenericRow
      key={rowKey}
      width={leftColumnWidth}
      title={
        isEmptyValue ? (
          <Text color="secondary" italic variant="bodySmall">
            {t('alerting.triage.group-row.no-label', 'No {{label}}', { label: row.metadata.label })}
          </Text>
        ) : (
          <AlertLabel
            size="sm"
            labelKey={row.metadata.label}
            value={formatLabelValue(row.metadata.value)}
            colorBy="key"
          />
        )
      }
      actions={<RowActions counts={row.instanceCounts} />}
      isOpenByDefault={!isEmptyValue}
      leftColumnClassName={groupRowStyles.groupRow}
      rightColumnClassName={groupRowStyles.empty}
      depth={depth}
    >
      {children}
    </GenericRow>
  );
};

