// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/OperationExplainedBox.tsx
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';

import { renderMarkdown } from '@grafana/data';

import { operationExplainedBoxStyles } from './OperationExplainedBox.stylex';

interface Props {
  title?: React.ReactNode;
  children?: React.ReactNode;
  markdown?: string;
  stepNumber?: number;
}

export function OperationExplainedBox({ title, stepNumber, markdown, children }: Props) {
  return (
    <div {...stylex.props(operationExplainedBoxStyles.box)}>
      {stepNumber !== undefined && (
        <div {...stylex.props(operationExplainedBoxStyles.stepNumber)}>{stepNumber}</div>
      )}
      <div>
        {title && (
          <div {...stylex.props(operationExplainedBoxStyles.header)}>
            <span>{title}</span>
          </div>
        )}
        <div {...stylex.props(operationExplainedBoxStyles.body)}>
          {markdown && <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}></div>}
          {children}
        </div>
      </div>
    </div>
  );
}
