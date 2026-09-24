// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/OperationsEditorRow.tsx
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';

import { Stack } from '@grafana/ui';

import { operationsEditorRowStyles } from './OperationsEditorRow.stylex';

interface Props {
  operationsLength: number;
  children: React.ReactNode;
}

export function OperationsEditorRow({ operationsLength, children }: Props) {
  return (
    <div
      {...stylex.props(
        operationsLength ? operationsEditorRowStyles.rootWithOperations : operationsEditorRowStyles.rootEmpty
      )}
    >
      <Stack gap={1}>{children}</Stack>
    </div>
  );
}
