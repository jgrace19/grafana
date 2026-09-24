import { type DraggableProvided } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { type MouseEventHandler } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Icon, IconButton, Stack } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.column)}>
        {collapsable && (
          <IconButton
            name={isContentVisible ? 'angle-down' : 'angle-right'}
            tooltip={tooltipMessage}
            xstyle={styles.toggle}
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
          <div {...stylex.props(styles.titleWrapper)} onClick={onRowToggle}>
            <div {...stylex.props(styles.title, disabled && styles.disabled)}>{title}</div>
          </div>
        )}
        {headerElement}
      </div>

      <Stack gap={1} alignItems="center">
        {actionsElement}
        {draggable && (
          <div onMouseMove={reportDragMousePosition} {...dragHandleProps}>
            <Icon title={dragAndDropLabel} name="draggabledots" size="lg" xstyle={styles.dragIcon} />
          </div>
        )}
      </Stack>
    </div>
  );
};

const styles = stylex.create({
  toggle: {
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    color: colors['--gf-colors-text-disabled'],
  },
  header: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    minHeight: spacing['--gf-spacing-x4'],
    display: 'grid',
    gridTemplateColumns: 'minmax(100px, max-content) min-content',
    alignItems: 'center',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',
    outline: { default: null, ':focus': 'none' },
  },
  column: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dragIcon: {
    cursor: 'grab',
    color: { default: colors['--gf-colors-text-disabled'], ':hover': colors['--gf-colors-text-primary'] },
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    cursor: 'pointer',
    overflow: 'hidden',
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  title: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    color: colors['--gf-colors-text-link'],
    marginLeft: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  disabled: {
    color: colors['--gf-colors-text-disabled'],
  },
});

QueryOperationRowHeader.displayName = 'QueryOperationRowHeader';
