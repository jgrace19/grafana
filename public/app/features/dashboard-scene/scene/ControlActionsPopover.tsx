import { autoUpdate, offset, safePolygon, useFloating, useHover, useInteractions } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import React, { cloneElement, useCallback, useState } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, Portal } from '@grafana/ui';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import './ControlActionsPopover.css';

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
          <div ref={refs.setFloating} {...stylex.props(styles.popover)} style={floatingStyles} {...getFloatingProps()}>
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
    <div {...stylex.props(styles.hoverActions)}>
      <IconButton
        name="pen"
        variant="primary"
        size="md"
        className="gf-control-edit-action gf-control-edit-action--edit"
        onPointerDown={onClickEditInternal}
        aria-label={t('dashboard-scene.control-edit-actions.aria-label-edit', 'Edit')}
      />
      <div {...stylex.props(styles.actionsDivider)} />
      <IconButton
        name="trash-alt"
        variant="destructive"
        size="md"
        className="gf-control-edit-action gf-control-edit-action--delete"
        onPointerDown={onClickDeleteInternal}
        aria-label={t('dashboard-scene.control-edit-actions.aria-label-delete', 'Delete')}
      />
    </div>
  );
}

// The IconButton overrides live in ControlActionsPopover.css: they must beat IconButton's own margin and color.
const styles = stylex.create({
  popover: {
    zIndex: zIndex.portal,
  },
  hoverActions: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    padding: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z1'],
    position: 'relative',
    top: '2px',
  },
  actionsDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors['--gf-colors-border-medium'],
  },
});
