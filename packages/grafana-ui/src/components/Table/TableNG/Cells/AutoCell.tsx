import * as stylex from '@stylexjs/stylex';

import { formattedValueToString } from '@grafana/data';

import { rdgCellMarker, rdgSelectableMarker } from '../../markers.stylex';
import { MaybeWrapWithLink } from '../components/MaybeWrapWithLink';
import { TABLE } from '../constants';
import { type AutoCellProps, type TableCellStyles } from '../types';
import { IS_SAFARI_26 } from '../utils';

export function AutoCell({ value, field, rowIdx }: AutoCellProps) {
  const displayValue = field.display!(value);
  const formattedValue = formattedValueToString(displayValue);
  return (
    <MaybeWrapWithLink field={field} rowIdx={rowIdx}>
      {formattedValue}
    </MaybeWrapWithLink>
  );
}

/**
 * "Active" means selected or (except on Safari 26) hovered: the cell itself, or, when the styles sit on the
 * max-height wrapper, the react-data-grid cell or row around it.
 */
export const getStyles: TableCellStyles = (_theme, { textWrap, shouldOverflow, maxHeight }) => {
  const nested = Boolean(maxHeight);
  const clamp = maxHeight != null && textWrap;
  return {
    xstyle: [
      textWrap && styles.wrap,
      !textWrap &&
        shouldOverflow &&
        (nested
          ? IS_SAFARI_26
            ? styles.wrapWhenNestedSelected
            : styles.wrapWhenNestedActive
          : IS_SAFARI_26
            ? styles.wrapWhenSelected
            : styles.wrapWhenActive),
      clamp && (IS_SAFARI_26 ? styles.clampUnlessNestedSelected : styles.clampUnlessNestedActive),
    ],
    style: clamp ? { '--gf-table-ng-line-clamp': Math.floor(maxHeight / TABLE.LINE_HEIGHT) } : undefined,
  };
};

export const getJsonCellStyles: TableCellStyles = (_theme, { textWrap, shouldOverflow, maxHeight }) => {
  const nested = Boolean(maxHeight);
  return {
    xstyle: [
      jsonStyles.json,
      textWrap && jsonStyles.pre,
      !textWrap &&
        shouldOverflow &&
        (nested
          ? IS_SAFARI_26
            ? jsonStyles.preWhenNestedSelected
            : jsonStyles.preWhenNestedActive
          : IS_SAFARI_26
            ? jsonStyles.preWhenSelected
            : jsonStyles.preWhenActive),
    ],
  };
};

const selected = ':is([aria-selected="true"])';

const styles = stylex.create({
  wrap: {
    whiteSpace: 'pre-line',
  },
  wrapWhenActive: {
    whiteSpace: { default: null, [selected]: 'pre-line', ':hover': 'pre-line' },
  },
  wrapWhenSelected: {
    whiteSpace: { default: null, [selected]: 'pre-line' },
  },
  wrapWhenNestedActive: {
    whiteSpace: {
      default: null,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'pre-line',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'pre-line',
    },
  },
  wrapWhenNestedSelected: {
    whiteSpace: {
      default: null,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'pre-line',
    },
  },
  // Line clamping to the max row height; the line count is the inline `--gf-table-ng-line-clamp`.
  clampUnlessNestedActive: {
    height: {
      default: 'auto',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'fit-content',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'fit-content',
    },
    overflowY: {
      default: 'hidden',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'auto',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'auto',
    },
    display: {
      default: '-webkit-box',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'flex',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'flex',
    },
    WebkitBoxOrient: {
      default: 'vertical',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'unset',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'unset',
    },
    WebkitLineClamp: {
      default: 'var(--gf-table-ng-line-clamp)',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'none',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'none',
    },
  },
  clampUnlessNestedSelected: {
    height: {
      default: 'auto',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'fit-content',
    },
    overflowY: {
      default: 'hidden',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'auto',
    },
    display: {
      default: '-webkit-box',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'flex',
    },
    WebkitBoxOrient: {
      default: 'vertical',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'unset',
    },
    WebkitLineClamp: {
      default: 'var(--gf-table-ng-line-clamp)',
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'none',
    },
  },
});

const jsonStyles = stylex.create({
  json: {
    fontFamily: 'monospace',
  },
  pre: {
    whiteSpace: 'pre',
  },
  preWhenActive: {
    whiteSpace: { default: null, [selected]: 'pre', ':hover': 'pre' },
  },
  preWhenSelected: {
    whiteSpace: { default: null, [selected]: 'pre' },
  },
  preWhenNestedActive: {
    whiteSpace: {
      default: null,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'pre',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'pre',
    },
  },
  preWhenNestedSelected: {
    whiteSpace: {
      default: null,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'pre',
    },
  },
});
