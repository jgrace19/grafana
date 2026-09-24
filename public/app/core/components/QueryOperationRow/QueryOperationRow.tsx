import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryOperationRowStyles } from './QueryOperationRow.stylex';
import { Draggable } from '@hello-pangea/dnd';
import { useCallback, useEffect, useId, useState } from 'react';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';

import { reportInteraction } from '@grafana/runtime';
import { ReactUtils } from '@grafana/ui';

import { QueryOperationRowHeader, type ExpanderMessages } from './QueryOperationRowHeader';

export interface QueryOperationRowProps {
  index: number;
  id: string;
  title?: string;
  headerElement?: QueryOperationRowRenderProp;
  actions?: QueryOperationRowRenderProp;
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
  draggable?: boolean;
  collapsable?: boolean;
  disabled?: boolean;
  expanderMessages?: ExpanderMessages;
}

export type QueryOperationRowRenderProp = ((props: QueryOperationRowRenderProps) => React.ReactNode) | React.ReactNode;

export interface QueryOperationRowRenderProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function QueryOperationRow({
  children,
  actions,
  title,
  headerElement,
  onClose,
  onOpen,
  isOpen,
  disabled,
  draggable,
  collapsable,
  index,
  id,
  expanderMessages,
}: QueryOperationRowProps) {
  const [isContentVisible, setIsContentVisible] = useState(isOpen !== undefined ? isOpen : true);
  const onRowToggle = useCallback(() => {
    setIsContentVisible(!isContentVisible);
  }, [isContentVisible, setIsContentVisible]);
  const contentId = useId();

  // Force QueryOperationRow expansion when `isOpen` prop updates in parent component.
  // `undefined` can be deliberately passed value here, but we only want booleans to trigger the effect.
  useEffect(() => {
    if (typeof isOpen === 'boolean') {
      setIsContentVisible(isOpen);
    }
  }, [isOpen]);

  const reportDragMousePosition = useCallback((e: React.MouseEvent) => {
    // When drag detected react-beautiful-dnd will preventDefault the event
    // Ref: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/how-we-use-dom-events.md#a-mouse-drag-has-started-and-the-user-is-now-dragging
    if (e.defaultPrevented) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // report relative mouse position within the header element
      reportInteraction('query_row_reorder_drag_position', {
        x: x / rect.width,
        y: y / rect.height,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useUpdateEffect(() => {
    if (isContentVisible) {
      if (onOpen) {
        onOpen();
      }
    } else {
      if (onClose) {
        onClose();
      }
    }
  }, [isContentVisible]);

  const renderPropArgs: QueryOperationRowRenderProps = {
    isOpen: isContentVisible,
    onOpen: () => {
      setIsContentVisible(true);
    },
    onClose: () => {
      setIsContentVisible(false);
    },
  };

  const actionsElement = actions && ReactUtils.renderOrCallToRender(actions, renderPropArgs);
  const headerElementRendered = headerElement && ReactUtils.renderOrCallToRender(headerElement, renderPropArgs);

  if (draggable) {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided) => {
          return (
            <>
              <div ref={provided.innerRef} {...stylex.props(queryOperationRowStyles.wrapper)} {...provided.draggableProps}>
                <div>
                  <QueryOperationRowHeader
                    id={contentId}
                    actionsElement={actionsElement}
                    disabled={disabled}
                    draggable
                    collapsable={collapsable}
                    dragHandleProps={provided.dragHandleProps}
                    headerElement={headerElementRendered}
                    isContentVisible={isContentVisible}
                    onRowToggle={onRowToggle}
                    reportDragMousePosition={reportDragMousePosition}
                    title={title}
                    expanderMessages={expanderMessages}
                  />
                </div>
                {isContentVisible && (
                  <div {...stylex.props(queryOperationRowStyles.content)} id={contentId}>
                    {children}
                  </div>
                )}
              </div>
            </>
          );
        }}
      </Draggable>
    );
  }

  return (
    <div {...stylex.props(queryOperationRowStyles.wrapper)}>
      <QueryOperationRowHeader
        id={contentId}
        actionsElement={actionsElement}
        disabled={disabled}
        draggable={false}
        collapsable={collapsable}
        headerElement={headerElementRendered}
        isContentVisible={isContentVisible}
        onRowToggle={onRowToggle}
        reportDragMousePosition={reportDragMousePosition}
        title={title}
        expanderMessages={expanderMessages}
      />
      {isContentVisible && (
        <div {...stylex.props(queryOperationRowStyles.content)} id={contentId}>
          {children}
        </div>
      )}
    </div>
  );
}

;

QueryOperationRow.displayName = 'QueryOperationRow';
