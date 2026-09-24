import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { folderGroupRowStyles } from './FolderGroupRow.stylex';
import { isString } from 'lodash';
import React from 'react';

import { Stack, Text } from '@grafana/ui';

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
      leftColumnClassName={folderGroupRowStyles.folderGroupRow}
      rightColumnClassName={folderGroupRowStyles.empty}
      depth={depth}
    >
      {children}
    </GenericRow>
  );
};

