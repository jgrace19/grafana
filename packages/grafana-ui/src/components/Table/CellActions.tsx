import * as stylex from '@stylexjs/stylex';
import { useCallback } from 'react';
import * as React from 'react';

import { t } from '@grafana/i18n';

import { components, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconSize } from '../../types/icon';
import { IconButton } from '../IconButton/IconButton';
import { Stack } from '../Layout/Stack/Stack';
import { type TooltipPlacement } from '../Tooltip/types';

import { TableCellInspectorMode } from './TableCellInspector';
import { cellContainerMarker } from './markers.stylex';
import { FILTER_FOR_OPERATOR, FILTER_OUT_OPERATOR, type TableCellProps } from './types';
import { getTextAlign } from './utils';

interface CellActionProps extends TableCellProps {
  previewMode: TableCellInspectorMode;
}

interface CommonButtonProps {
  size: IconSize;
  showFilters?: boolean;
  tooltipPlacement: TooltipPlacement;
}

export function CellActions({
  field,
  cell,
  previewMode,
  showFilters,
  onCellFilterAdded,
  setInspectCell,
}: CellActionProps) {
  const isRightAligned = getTextAlign(field) === 'flex-end';
  const inspectEnabled = Boolean(field.config.custom?.inspect);
  const commonButtonProps: CommonButtonProps = {
    size: 'sm',
    tooltipPlacement: 'top',
  };

  const onFilterFor = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onCellFilterAdded) {
        onCellFilterAdded({ key: field.name, operator: FILTER_FOR_OPERATOR, value: cell.value });
      }
    },
    [cell, field, onCellFilterAdded]
  );
  const onFilterOut = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onCellFilterAdded) {
        onCellFilterAdded({ key: field.name, operator: FILTER_OUT_OPERATOR, value: cell.value });
      }
    },
    [cell, field, onCellFilterAdded]
  );

  return (
    // Inspect-enabled cells don't overflow on hover, so their actions overlay the cell instead of sitting inline.
    <div
      {...stylex.props(
        styles.cellActions,
        inspectEnabled ? styles.cellActionsAbsolute : styles.cellActionsInline,
        isRightAligned && styles.cellActionsLeft
      )}
    >
      <Stack gap={0.5}>
        {inspectEnabled && (
          <IconButton
            name="eye"
            tooltip={t('grafana-ui.table.cell-inspect', 'Inspect value')}
            onClick={() => {
              if (setInspectCell) {
                let mode = TableCellInspectorMode.text;
                let inspectValue = cell.value;
                try {
                  const parsed = typeof inspectValue === 'string' ? JSON.parse(inspectValue) : inspectValue;
                  const isPlainObj =
                    typeof parsed === 'object' &&
                    parsed !== null &&
                    !Array.isArray(parsed) &&
                    (Object.getPrototypeOf(parsed) === Object.prototype || Object.getPrototypeOf(parsed) === null);
                  if (Array.isArray(parsed) || isPlainObj) {
                    inspectValue = JSON.stringify(parsed, null, 2);
                    mode = TableCellInspectorMode.code;
                  }
                } catch {
                  // do nothing
                }
                setInspectCell({ value: inspectValue, mode });
              }
            }}
            {...commonButtonProps}
          />
        )}
        {showFilters && (
          <IconButton
            name={'search-plus'}
            onClick={onFilterFor}
            tooltip={t('grafana-ui.table.cell-filter-on', 'Filter for value')}
            {...commonButtonProps}
          />
        )}
        {showFilters && (
          <IconButton
            name={'search-minus'}
            onClick={onFilterOut}
            tooltip={t('grafana-ui.table.cell-filter-out', 'Filter out value')}
            {...commonButtonProps}
          />
        )}
      </Stack>
    </div>
  );
}

const styles = stylex.create({
  cellActions: {
    display: 'flex',
    visibility: { default: 'hidden', [stylex.when.ancestor(':hover', cellContainerMarker)]: 'visible' },
    opacity: { default: 0, [stylex.when.ancestor(':hover', cellContainerMarker)]: 1 },
    width: { default: 0, [stylex.when.ancestor(':hover', cellContainerMarker)]: 'auto' },
    alignItems: 'center',
    height: '100%',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
    backgroundColor: components['--gf-components-tooltip-background'],
    color: components['--gf-components-tooltip-text'],
    borderRadius: {
      default: null,
      [stylex.when.ancestor(':hover', cellContainerMarker)]: shape['--gf-shape-radius-default'],
    },
  },
  cellActionsInline: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x1'],
  },
  cellActionsAbsolute: {
    position: 'absolute',
    top: '1px',
    right: 0,
    marginTop: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
  },
  cellActionsLeft: {
    right: 'auto',
    left: 0,
  },
});
