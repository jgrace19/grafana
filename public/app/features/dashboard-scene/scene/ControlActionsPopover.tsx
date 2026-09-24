import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { controlActionsPopoverStyles } from './ControlActionsPopover.stylex';
import { autoUpdate, offset, safePolygon, useFloating, useHover, useInteractions } from '@floating-ui/react';
import React, { cloneElement, useCallback, useState } from 'react';

import { t } from '@grafana/i18n';
import {IconButton, Portal} from '@grafana/ui';

export function ControlActionsPopover({
  isEditable,
  content,
  children,
}: {
  isEditable: boolean;
  content: React.ReactNode;
  children: React.JSX.Element;
}) {

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top-start',
    middleware: [offset(0)],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { handleClose: safePolygon() });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  if (!isEditable) {
    return children;
  }

  return (
    <>
      {cloneElement(children, { ref: refs.setReference, ...getReferenceProps() })}
      {isOpen && content && (
        <Portal>
          <div ref={refs.setFloating} style={floatingStyles} {...stylex.props(controlActionsPopoverStyles.popover)} {...getFloatingProps()}>
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

export function ControlEditActions({
  onClickEdit,
  onClickDelete,
}: {
  onClickEdit: () => void;
  onClickDelete: () => void;
}) {


  const onClickEditInternal = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClickEdit();
    },
    [onClickEdit]
  );
  const onClickDeleteInternal = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClickDelete();
    },
    [onClickDelete]
  );

  return (
    <div {...stylex.props(controlActionsPopoverStyles.hoverActions)}>
      <IconButton
        name="pen"
        variant="primary"
        size="md"
        {...mergeStylexClassName(stylex.props(controlActionsPopoverStyles.action), clsx(controlActionsPopoverStyles.editAction))}
        onPointerDown={onClickEditInternal}
        aria-label={t('dashboard-scene.control-edit-actions.aria-label-edit', 'Edit')}
      />
      <div {...stylex.props(controlActionsPopoverStyles.actionsDivider)} />
      <IconButton
        name="trash-alt"
        variant="destructive"
        size="md"
        {...mergeStylexClassName(stylex.props(controlActionsPopoverStyles.action), clsx(controlActionsPopoverStyles.deleteAction))}
        onPointerDown={onClickDeleteInternal}
        aria-label={t('dashboard-scene.control-edit-actions.aria-label-delete', 'Delete')}
      />
    </div>
  );
}

