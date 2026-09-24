import { autoUpdate, offset, safePolygon, useFloating, useHover, useInteractions } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import React, { cloneElement, useCallback, useState } from 'react';

import { t } from '@grafana/i18n';
import { IconButton, Portal } from '@grafana/ui';
import { motion, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
        xstyle={[styles.editAction, styles.editActionEdit]}
        onPointerDown={onClickEditInternal}
        aria-label={t('dashboard-scene.control-edit-actions.aria-label-edit', 'Edit')}
      />
      <div {...stylex.props(styles.actionsDivider)} />
      <IconButton
        name="trash-alt"
        variant="destructive"
        size="md"
        xstyle={[styles.editAction, styles.editActionDelete]}
        onPointerDown={onClickDeleteInternal}
        aria-label={t('dashboard-scene.control-edit-actions.aria-label-delete', 'Delete')}
      />
    </div>
  );
}

const styles = stylex.create({
  // Over IconButton: its keyboard-focus transition still applies; the colour transition covers every other state.
  editAction: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    transitionProperty: {
      default: null,
      ':focus': 'outline, outline-offset, box-shadow',
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': 'color' },
    },
    transitionDuration: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' },
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': '250ms' },
    },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
      [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': 'cubic-bezier(0.4, 0, 0.2, 1)' },
    },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: { default: null, ':not(:focus-visible)': '0ms' } },
  },
  editActionEdit: {
    color: { default: colors['--gf-colors-text-primary'], ':hover': colors['--gf-colors-primary-text'] },
  },
  editActionDelete: {
    color: { default: colors['--gf-colors-text-primary'], ':hover': colors['--gf-colors-error-text'] },
  },
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
