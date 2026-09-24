import * as stylex from '@stylexjs/stylex';
import { isString } from 'lodash';
import React from 'react';

import { Stack, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { MetaText } from '../../components/MetaText';
import { type GenericGroupedRow } from '../types';

import { GenericRow } from './GenericRow';
import { RowActions } from './InstanceCountBadges';

interface FolderGroupRowProps {
  row: GenericGroupedRow;
  leftColumnWidth: number;
  rowKey: React.Key;
  depth?: number;
  children?: React.ReactNode;
}

export const FolderGroupRow = ({ row, leftColumnWidth, rowKey, depth = 0, children }: FolderGroupRowProps) => {
  return (
    <GenericRow
      key={rowKey}
      width={leftColumnWidth}
      title={
        <Stack direction="row" gap={0.5} alignItems="center">
          <MetaText icon="folder" />
          {isString(row.metadata.value) && <Text color="primary">{row.metadata.value}</Text>}
        </Stack>
      }
      actions={<RowActions counts={row.instanceCounts} />}
      isOpenByDefault={true}
      leftColumnXstyle={styles.folderGroupRow}
      depth={depth}
    >
      {children}
    </GenericRow>
  );
};

const styles = stylex.create({
  folderGroupRow: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    marginTop: spacing['--gf-spacing-x0-5'],
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
});
