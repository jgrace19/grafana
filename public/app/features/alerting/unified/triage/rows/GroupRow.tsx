import * as stylex from '@stylexjs/stylex';
import React from 'react';

import { AlertLabel } from '@grafana/alerting/unstable';
import { t } from '@grafana/i18n';
import { Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      leftColumnXstyle={styles.groupRow}
      depth={depth}
    >
      {children}
    </GenericRow>
  );
};

const styles = stylex.create({
  groupRow: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    marginTop: spacing['--gf-spacing-x0-5'],
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
});
