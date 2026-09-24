import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryOperationRowHeaderStyles } from './QueryOperationRowHeader.stylex';
import { type DraggableProvided } from '@hello-pangea/dnd';
import { type MouseEventHandler } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Icon, IconButton, Stack } from '@grafana/ui';

export interface QueryOperationRowHeaderProps {
  actionsElement?: React.ReactNode;
  disabled?: boolean;
  draggable: boolean;
  collapsable?: boolean;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  headerElement?: React.ReactNode;
  isContentVisible: boolean;
  onRowToggle: () => void;
  reportDragMousePosition: MouseEventHandler<HTMLDivElement>;
  title?: string;
  id: string;
  expanderMessages?: ExpanderMessages;
}

export interface ExpanderMessages {
  open: string;
  close: string;
}

export const QueryOperationRowHeader = ({
  actionsElement,
  disabled,
  draggable,
  collapsable = true,
  dragHandleProps,
  headerElement,
  isContentVisible,
  onRowToggle,
  reportDragMousePosition,
  title,
  id,
  expanderMessages,
}: QueryOperationRowHeaderProps) => {

  let tooltipMessage = isContentVisible
    ? t('query-operation.header.collapse-row', 'Collapse query row')
    : t('query-operation.header.expand-row', 'Expand query row');
  if (expanderMessages !== undefined && isContentVisible) {
    tooltipMessage = expanderMessages.close;
  } else if (expanderMessages !== undefined) {
    tooltipMessage = expanderMessages?.open;
  }

  const dragAndDropLabel = t('query-operation.header.drag-and-drop', 'Drag and drop to reorder');

  return (
    <div {...stylex.props(queryOperationRowHeaderStyles.header)}>
      <div {...stylex.props(queryOperationRowHeaderStyles.column)}>
        {collapsable && (
          <IconButton
            name={isContentVisible ? 'angle-down' : 'angle-right'}
            tooltip={tooltipMessage}
            {...stylex.props(queryOperationRowHeaderStyles.collapseIcon)}
            onClick={onRowToggle}
            aria-expanded={isContentVisible}
            aria-controls={id}
            tabIndex={0}
          />
        )}
        {title && (
          // disabling the a11y rules here as the IconButton above handles keyboard interactions
          // this is just to provide a better experience for mouse users
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div {...stylex.props(queryOperationRowHeaderStyles.titleWrapper)} onClick={onRowToggle}>
            <div {...mergeStylexClassName(stylex.props(queryOperationRowHeaderStyles.title, disabled && queryOperationRowHeaderStyles.disabled), undefined)}>{title}</div>
          </div>
        )}
        {headerElement}
      </div>

      <Stack gap={1} alignItems="center">
        {actionsElement}
        {draggable && (
          <div onMouseMove={reportDragMousePosition} {...dragHandleProps}>
            <Icon title={dragAndDropLabel} name="draggabledots" size="lg" {...stylex.props(queryOperationRowHeaderStyles.dragIcon)} />
          </div>
        )}
      </Stack>
    </div>
  );
};


QueryOperationRowHeader.displayName = 'QueryOperationRowHeader';
