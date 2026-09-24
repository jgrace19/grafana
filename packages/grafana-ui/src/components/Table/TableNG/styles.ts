import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import memoize from 'micro-memoize';
import { type CSSProperties } from 'react';

import { type GrafanaTheme2, colorManipulator } from '@grafana/data';

import { zIndex } from '../../../themes/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '../../../themes/stylex/tokens.stylex';
import { defaultCellMarker, rdgCellMarker, rdgSelectableMarker } from '../markers.stylex';
import { type TableStyleProps } from '../types';

import { type TableCellStyleOptions } from './types';
import { IS_SAFARI_26, type TextAlign } from './utils';

import './TableNG.css';

/** @internal */
export interface TableNGClassNameAndStyle {
  className?: string;
  style?: CSSProperties;
}

/**
 * @internal
 * Styles for the DataGrid root and the elements TableNG renders around it. The rules that target
 * react-data-grid's own DOM live in TableNG.css, scoped under `gf-table-ng`.
 */
export const getGridStyles = memoize((theme: GrafanaTheme2, enablePagination?: boolean, transparent?: boolean) => {
  const bgColor = transparent ? theme.colors.background.canvas : theme.colors.background.primary;
  // this needs to be pre-calc'd since the theme colors have alpha and the border color becomes
  // unpredictable for background color cells
  const borderColor = colorManipulator.onBackground(theme.colors.border.weak, bgColor).toHexString();
  const selectedRowColor = theme.isDark
    ? colorManipulator.onBackground(theme.colors.warning.main, bgColor).darken(37).toHexString()
    : colorManipulator.onBackground(theme.colors.warning.main, bgColor).lighten(25).toHexString();

  const selectedRowHoverColor = theme.colors.emphasize(selectedRowColor, 0.05);

  const gridStyles = [
    gridStylesheet.grid,
    enablePagination ? gridStylesheet.gridPaginated : gridStylesheet.gridFull,
    gridStylesheet.gridColors(
      bgColor,
      borderColor,
      // note: this cannot have any transparency since default cells that
      // overlay/overflow on hover inherit this background and need to occlude cells below
      transparent ? theme.colors.background.primary : theme.colors.background.secondary,
      selectedRowColor,
      selectedRowHoverColor,
      theme.isDark ? '#fff5 #fff1' : '#0005 #0001'
    ),
  ];
  const rootClassName = clsx('gf-table-ng', !IS_SAFARI_26 && 'gf-table-ng-hover');
  const grid = stylex.props(gridStyles);
  const gridNested = stylex.props(gridStyles, gridStylesheet.gridNested);

  return {
    grid: { className: clsx(grid.className, rootClassName), style: grid.style } satisfies TableNGClassNameAndStyle,
    gridNested: {
      className: clsx(gridNested.className, rootClassName),
      style: gridNested.style,
    } satisfies TableNGClassNameAndStyle,
    cellNested: stylex.props(gridStylesheet.cellNested).className,
    noDataNested: gridStylesheet.noDataNested,
    headerRow: clsx('gf-table-ng-header-row', stylex.props(gridStylesheet.headerRow).className),
    headerRowHidden: clsx(
      'gf-table-ng-header-row',
      stylex.props(gridStylesheet.headerRow, gridStylesheet.displayNone).className
    ),
    paginationContainer: gridStylesheet.paginationContainer,
    paginationSummary: gridStylesheet.paginationSummary,
    safariWrapper: gridStylesheet.safariWrapper,
  };
});

/** @internal Class name for react-data-grid's `headerCellClass`. */
export const getHeaderCellStyles = memoize(
  (_theme: GrafanaTheme2, textAlign: TextAlign) =>
    stylex.props(headerCellStyles.headerCell, justifyContentStyles[textAlign]).className
);

/** @internal Classes for the markers that nested cell styles key on; add them to every body cell. */
export const rdgCellMarkerClassName = stylex.props(rdgCellMarker, rdgSelectableMarker).className;
/** @internal */
export const rdgRowMarkerClassName = stylex.props(rdgSelectableMarker).className;

/** @internal */
export const getDefaultCellStyles = (
  _theme: GrafanaTheme2,
  { textAlign, shouldOverflow, maxHeight }: TableCellStyleOptions
): TableStyleProps => [
  defaultCellMarker,
  cellStyles.defaultCell,
  textAlignStyles[textAlign],
  Boolean(maxHeight) ? cellStyles.justifyStart : justifyContentStyles[textAlign],
  Boolean(maxHeight) && cellStyles.overflowYHidden,
  shouldOverflow && cellStyles.minHeightFull,
  shouldOverflow && (IS_SAFARI_26 ? cellStyles.overflowSelected : cellStyles.overflowActive),
];

/** @internal Styles for the wrapper that clamps a cell to the max row height. */
export const getMaxHeightCellStyles = (
  _theme: GrafanaTheme2,
  { textAlign, maxHeight }: TableCellStyleOptions
): TableStyleProps => [
  maxHeightStyles.maxHeightCell,
  textAlignStyles[textAlign],
  justifyContentStyles[textAlign],
  IS_SAFARI_26
    ? maxHeightStyles.maxHeightSelected(maxHeight ?? 'none')
    : maxHeightStyles.maxHeight(maxHeight ?? 'none'),
];

/** @internal Class name for the cell actions container. */
export const getCellActionStyles = memoize(
  (theme: GrafanaTheme2, textAlign: TextAlign) =>
    stylex.props(
      cellActionStyles.actions,
      theme.isDark ? cellActionStyles.dark : cellActionStyles.light,
      textAlign === 'right' ? cellActionStyles.alignLeft : cellActionStyles.alignRight,
      // Safari 26 never showed the actions: its hover selector was empty, so Emotion emitted an invalid rule.
      !IS_SAFARI_26 && cellActionStyles.showOnCellHover
    ).className
);

/** @internal Class name that styles the links inside a cell (TableNG.css). */
export const getLinkStyles = (_theme: GrafanaTheme2, canBeColorized: boolean) =>
  canBeColorized ? 'gf-table-ng-links-colorized' : 'gf-table-ng-links';

/** @internal */
export const getTooltipStyles = memoize((_theme: GrafanaTheme2, textAlign: TextAlign) => ({
  tooltipContent: tooltipStyles.tooltipContent,
  tooltipWrapper: stylex.props(tooltipStyles.tooltipWrapper).className,
  tooltipCaret: stylex.props(
    tooltipStyles.tooltipCaret,
    textAlign === 'right' ? tooltipStyles.caretRight : tooltipStyles.caretLeft
  ).className,
}));

// COLUMN.EXPANDER_WIDTH and TABLE.CELL_PADDING (constants.ts); stylex.create can't read imported values.
const EXPANDER_WIDTH = 50;
const CELL_PADDING = 6;
const selected = ':is([aria-selected="true"])';

const gridStylesheet = stylex.create({
  grid: {
    '--rdg-color': colors['--gf-colors-text-primary'],
    '--rdg-summary-border-width': '1px',
    '--rdg-selection-color': colors['--gf-colors-info-transparent'],
    scrollbarWidth: 'thin',
    borderStyle: 'none',
    borderWidth: 'medium',
    borderColor: 'currentcolor',
  },
  gridColors: (
    background: string,
    border: string,
    rowHover: string,
    rowSelected: string,
    rowSelectedHover: string,
    scrollbarColor: string
  ) => ({
    '--rdg-background-color': background,
    '--rdg-header-background-color': background,
    '--rdg-border-color': border,
    '--rdg-summary-border-color': border,
    '--rdg-row-background-color': background,
    '--rdg-row-hover-background-color': rowHover,
    '--rdg-row-selected-background-color': rowSelected,
    '--rdg-row-selected-hover-background-color': rowSelectedHover,
    scrollbarColor,
  }),
  // TODO: magic 32px number is unfortunate. it would be better to have the content
  // flow using flexbox rather than hard-coding this size via a calc
  gridPaginated: {
    blockSize: 'calc(100% - 32px)',
  },
  gridFull: {
    blockSize: '100%',
  },
  gridNested: {
    height: '100%',
    width: `calc(100% - ${EXPANDER_WIDTH - CELL_PADDING * 2 - 1}px)`,
    overflowX: 'scroll',
    overflowY: 'hidden',
    marginLeft: `${EXPANDER_WIDTH - CELL_PADDING - 1}px`,
    marginTop: `${CELL_PADDING}px`,
    marginBottom: `${CELL_PADDING}px`,
    // usually row height will be set to 0 when not expanded, but auto cell height may lead to some rendering errors.
    display: { default: null, ':is([aria-expanded="false"])': 'none' },
  },
  cellNested: {
    outlineStyle: { default: null, [selected]: 'none' },
    backgroundColor: { default: null, ':hover': 'transparent' },
  },
  noDataNested: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-h4-font-size'],
  },
  // The header row's `.rdg-cell` rule is in TableNG.css.
  headerRow: {
    paddingTop: 0,
    fontWeight: 'normal',
  },
  displayNone: { display: 'none' },
  paginationContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
    width: '100%',
  },
  paginationSummary: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  safariWrapper: {
    contain: 'strict',
    height: '100%',
  },
});

const headerCellStyles = stylex.create({
  headerCell: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
    zIndex: `calc(${zIndex.tooltip} - 1)`,
    paddingLeft: `${CELL_PADDING}px`,
    paddingRight: `${CELL_PADDING}px`,
    paddingBottom: `${CELL_PADDING}px`,
    borderInlineEndStyle: { default: null, ':last-child': 'none' },
  },
});

const textAlignStyles = stylex.create({
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },
  center: { textAlign: 'center' },
});

const justifyContentStyles = stylex.create({
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  center: { justifyContent: 'center' },
});

const cellStyles = stylex.create({
  defaultCell: {
    display: 'flex',
    alignItems: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  overflowYHidden: {
    overflowY: 'hidden',
  },
  minHeightFull: {
    minHeight: '100%',
  },
  overflowActive: {
    zIndex: { default: null, [selected]: `calc(${zIndex.tooltip} - 2)`, ':hover': `calc(${zIndex.tooltip} - 2)` },
    height: { default: null, [selected]: 'fit-content', ':hover': 'fit-content' },
    minWidth: { default: null, [selected]: 'fit-content', ':hover': 'fit-content' },
  },
  overflowSelected: {
    zIndex: { default: null, [selected]: `calc(${zIndex.tooltip} - 2)` },
    height: { default: null, [selected]: 'fit-content' },
    minWidth: { default: null, [selected]: 'fit-content' },
  },
});

const maxHeightStyles = stylex.create({
  maxHeightCell: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    overflowY: 'hidden',
  },
  maxHeight: (maxHeight: number | string) => ({
    maxHeight: {
      default: maxHeight,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'none',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: 'none',
    },
    minHeight: {
      default: null,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: '100%',
      [stylex.when.ancestor(':hover', rdgCellMarker)]: '100%',
    },
  }),
  maxHeightSelected: (maxHeight: number | string) => ({
    maxHeight: {
      default: maxHeight,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: 'none',
    },
    minHeight: {
      default: null,
      [stylex.when.ancestor('[aria-selected="true"]', rdgSelectableMarker)]: '100%',
    },
  }),
});

const cellActionStyles = stylex.create({
  actions: {
    display: 'none',
    position: 'absolute',
    top: 0,
    marginTop: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    height: '100%',
    color: colors['--gf-colors-text-primary'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingInlineStart: spacing['--gf-spacing-x1'],
    paddingInlineEnd: spacing['--gf-spacing-x0-5'],
  },
  dark: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  light: { backgroundColor: 'rgba(255, 255, 255, 0.7)' },
  alignLeft: { left: 0 },
  alignRight: { right: 0 },
  showOnCellHover: {
    display: { default: 'none', [stylex.when.ancestor(':hover', defaultCellMarker)]: 'flex' },
  },
});

const tooltipStyles = stylex.create({
  tooltipContent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  tooltipWrapper: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    overflow: 'hidden',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    width: 'inherit',
  },
  tooltipCaret: {
    cursor: 'pointer',
    position: 'absolute',
    top: spacing['--gf-spacing-x0-25'],
    width: `calc(${spacing['--gf-spacing-grid-size']} * 1.75)`,
    height: `calc(${spacing['--gf-spacing-grid-size']} * 1.75)`,
  },
  caretLeft: {
    left: spacing['--gf-spacing-x0-25'],
    backgroundImage: `linear-gradient(to top left, transparent 62.5%, ${colors['--gf-colors-border-strong']} 50%)`,
  },
  caretRight: {
    right: spacing['--gf-spacing-x0-25'],
    backgroundImage: `linear-gradient(to top right, transparent 62.5%, ${colors['--gf-colors-border-strong']} 50%)`,
  },
});
