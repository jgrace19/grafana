import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { type TableCellHeight } from '@grafana/schema';

import { motion } from '../../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../../themes/stylex/tokens.stylex';
import { cellContainerMarker } from '../markers.stylex';

import './TableRT.css';

/** Anything `stylex.props()` accepts: styles, dynamic styles and markers. */
export type TableStyleProps = stylex.StyleXArray<
  null | undefined | boolean | stylex.CompiledStyles | Readonly<[stylex.CompiledStyles, stylex.InlineStyles]>
>;

export function useTableStyles(theme: GrafanaTheme2, cellHeightOption: TableCellHeight) {
  const cellPadding = 6;
  const cellHeight = getCellHeight(theme, cellHeightOption, cellPadding);
  const rowHeight = cellHeight + 2;

  /**
   * Every property that has both a default and a `:hover` value is set by exactly one of the namespaces picked
   * here, because a later StyleX namespace replaces a property's `:hover` value along with its default.
   */
  const buildCellContainerStyle = (
    color?: string,
    background?: string,
    backgroundHover?: string,
    overflowOnHover?: boolean,
    asCellText?: boolean,
    textShouldWrap?: boolean,
    textWrapped?: boolean,
    rowStyled?: boolean,
    rowExpanded?: boolean
  ): TableStyleProps => {
    const overflowVisibleOnHover = overflowOnHover && !textWrapped;
    const heightAutoOnHover = (textShouldWrap || overflowOnHover) && !textWrapped;
    const innerHeight = rowHeight - 1;

    return [
      cellStyles.cellContainer,
      cellContainerMarker,
      textShouldWrap || !overflowOnHover ? cellStyles.widthHoverAuto : cellStyles.widthHoverAutoImportant,
      asCellText && cellStyles.asCellText,
      asCellText
        ? overflowVisibleOnHover
          ? cellStyles.overflowHiddenHoverVisible
          : cellStyles.overflowHidden
        : overflowVisibleOnHover && cellStyles.overflowHoverVisible,
      textShouldWrap && overflowOnHover
        ? asCellText
          ? cellStyles.whiteSpaceNowrapHoverNormal
          : cellStyles.whiteSpaceHoverNormal
        : asCellText
          ? cellStyles.whiteSpaceNowrap
          : cellStyles.whiteSpaceHoverNowrap,
      textWrapped
        ? textShouldWrap
          ? cellStyles.wordBreakAllHoverWord
          : cellStyles.wordBreakAll
        : textShouldWrap
          ? cellStyles.wordBreakInheritHoverWord
          : cellStyles.wordBreakInherit,
      rowExpanded
        ? cellStyles.heightAuto
        : heightAutoOnHover
          ? cellStyles.heightHoverAuto(innerHeight)
          : cellStyles.height(innerHeight),
      cellStyles.minHeightHover(innerHeight),
      overflowOnHover && cellStyles.hoverShadow,
      rowStyled && cellStyles.colorInherit,
      !rowStyled && color !== undefined && cellStyles.color(color),
      rowStyled
        ? cellStyles.backgroundHoverInherit
        : cellStyles.background(
            ...toBackground(background),
            ...toBackground(backgroundHover ?? theme.colors.background.primary)
          ),
    ];
  };

  return {
    theme,
    cellHeight,
    buildCellContainerStyle,
    cellPadding,
    cellHeightInner: cellHeight - cellPadding * 2,
    rowHeight,
    table: styles.table,
    thead: styles.thead,
    tfoot: styles.tfoot,
    headerRow: styles.headerRow,
    headerCell: styles.headerCell,
    headerCellLabel: styles.headerCellLabel,
    cellContainerText: buildCellContainerStyle(undefined, undefined, undefined, true, true),
    cellContainerTextNoOverflow: buildCellContainerStyle(undefined, undefined, undefined, false, true),

    cellContainer: buildCellContainerStyle(undefined, undefined, undefined, true, false),
    cellContainerNoOverflow: buildCellContainerStyle(undefined, undefined, undefined, false, false),
    cellText: styles.cellText,
    sortIcon: styles.sortIcon,
    cellLink: styles.cellLink,
    cellLinkEmpty: styles.cellLinkEmpty,
    cellLinkForColoredCell: styles.cellLinkForColoredCell,
    imageCellLink: styles.imageCellLink,
    headerFilter: styles.headerFilter,
    paginationWrapper: [styles.paginationWrapper, styles.height(cellHeight)],
    paginationSummary: styles.paginationSummary,
    tableContentWrapper: (totalColumnsWidth: number) =>
      [
        styles.tableContentWrapper,
        styles.width(totalColumnsWidth !== undefined ? `${totalColumnsWidth}px` : '100%'),
      ] satisfies TableStyleProps,
    row: styles.row,
    expandedRow: styles.expandedRow,
    imageCell: styles.imageCell,
    resizeHandle: styles.resizeHandle,
    typeIcon: styles.typeIcon,
    noData: styles.noData,
    expanderCell: [styles.expanderCell, styles.height(rowHeight)],
  };
}

export type TableStyles = ReturnType<typeof useTableStyles>;

/** className/style for a cell container: its StyleX styles merged with react-table's inline cell style. */
export function getCellContainerProps(
  xstyle: TableStyleProps,
  style?: CSSProperties
): { className?: string; style?: CSSProperties } {
  return mergeStylexProps(stylex.props(xstyle), { className: 'gf-table-rt-cell', style });
}

function getCellHeight(theme: GrafanaTheme2, cellHeightOption: TableCellHeight, cellPadding: number) {
  const bodyFontSize = theme.typography.fontSize;
  const lineHeight = theme.typography.body.lineHeight;

  switch (cellHeightOption) {
    case 'md':
      return 42;
    case 'lg':
      return 48;
    case 'sm':
    default:
      return cellPadding * 2 + bodyFontSize * lineHeight;
  }
}

/** `background: value` as [background-color, background-image]; cell colours can be gradients. */
function toBackground(value: string | undefined): [string | null, string | null] {
  if (value === undefined) {
    return [null, null];
  }
  return value.includes('gradient(') ? ['transparent', value] : [value, 'none'];
}

const headerHeight = '28px';

const styles = stylex.create({
  table: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  thead: {
    height: headerHeight,
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  tfoot: {
    height: headerHeight,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  headerRow: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  headerCell: {
    height: '100%',
    paddingTop: 0,
    paddingRight: '6px',
    paddingBottom: 0,
    paddingLeft: '6px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    borderRightStyle: { default: null, ':last-child': 'none' },
  },
  headerCellLabel: {
    borderStyle: 'none',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    backgroundColor: 'inherit',
    backgroundImage: 'inherit',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    display: 'flex',
    alignItems: 'center',
    marginRight: spacing['--gf-spacing-x0-5'],
    textDecoration: { default: null, ':hover': 'underline' },
    color: { default: null, ':hover': colors['--gf-colors-text-link'] },
  },
  cellText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'text',
    whiteSpace: 'nowrap',
    cursor: 'text',
  },
  sortIcon: {
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  // `!important` beats the cell container's `a { color: inherit }` rule (TableRT.css).
  cellLink: {
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'text',
    whiteSpace: 'nowrap',
    color: {
      default: `${colors['--gf-colors-text-link']} !important`,
      ':hover': colors['--gf-colors-text-link'],
    },
    fontWeight: typography['--gf-typography-font-weight-medium'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    textDecoration: { default: null, ':hover': 'underline' },
  },
  cellLinkEmpty: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'text',
    whiteSpace: 'nowrap',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    paddingRight: spacing['--gf-spacing-x1-5'],
  },
  cellLinkForColoredCell: {
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'text',
    whiteSpace: 'nowrap',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    textDecoration: 'underline',
  },
  imageCellLink: {
    cursor: 'pointer',
    overflow: 'hidden',
    height: '100%',
  },
  headerFilter: {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  // Pagination's `li` margin is reset in TableRT.css.
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  tableContentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    borderBottomWidth: { default: '1px', ':last-child': 0 },
    borderBottomStyle: { default: 'solid', ':last-child': 'none' },
    borderBottomColor: { default: colors['--gf-colors-border-weak'], ':last-child': 'currentcolor' },
    backgroundColor: { default: null, ':hover': components['--gf-components-table-row-hover-background'] },
  },
  // `'&:hover': { background: 'inherit' }` merged onto `row`.
  expandedRow: {
    backgroundColor: { default: null, ':hover': 'inherit' },
    backgroundImage: { default: null, ':hover': 'inherit' },
  },
  imageCell: {
    height: '100%',
  },
  resizeHandle: {
    cursor: 'col-resize',
    display: 'inline-block',
    backgroundColor: colors['--gf-colors-primary-border'],
    opacity: { default: 0, ':hover': 1 },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.2s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-in-out' },
    width: '8px',
    height: '100%',
    position: 'absolute',
    right: '-4px',
    borderRadius: shape['--gf-shape-radius-default'],
    top: 0,
    touchAction: 'none',
  },
  typeIcon: {
    marginRight: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-text-secondary'],
  },
  noData: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  expanderCell: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  height: (height: number) => ({ height }),
  width: (width: string) => ({ width }),
});

// The container's `a { color: inherit }` rule is in TableRT.css; `.cellActions` is styled by CellActions.
const cellStyles = stylex.create({
  cellContainer: {
    paddingTop: '6px',
    paddingRight: '6px',
    paddingBottom: '6px',
    paddingLeft: '6px',
    display: 'flex',
    alignItems: 'center',
    borderRightWidth: '1px',
    borderRightStyle: { default: 'solid', ':last-child': { default: null, ':not(:only-child)': 'none' } },
    borderRightColor: colors['--gf-colors-border-weak'],
    zIndex: { default: null, ':hover': 1 },
  },
  widthHoverAuto: {
    width: { default: '100%', ':hover': 'auto' },
  },
  widthHoverAutoImportant: {
    width: { default: '100%', ':hover': 'auto !important' },
  },
  asCellText: {
    textOverflow: 'ellipsis',
    userSelect: 'text',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  overflowHiddenHoverVisible: {
    overflow: { default: 'hidden', ':hover': 'visible' },
  },
  overflowHoverVisible: {
    overflow: { default: null, ':hover': 'visible' },
  },
  whiteSpaceNowrap: {
    whiteSpace: 'nowrap',
  },
  whiteSpaceNowrapHoverNormal: {
    whiteSpace: { default: 'nowrap', ':hover': 'normal' },
  },
  whiteSpaceHoverNormal: {
    whiteSpace: { default: null, ':hover': 'normal' },
  },
  whiteSpaceHoverNowrap: {
    whiteSpace: { default: null, ':hover': 'nowrap' },
  },
  wordBreakAll: {
    wordBreak: 'break-all',
  },
  wordBreakAllHoverWord: {
    wordBreak: { default: 'break-all', ':hover': 'break-word' },
  },
  wordBreakInherit: {
    wordBreak: 'inherit',
  },
  wordBreakInheritHoverWord: {
    wordBreak: { default: 'inherit', ':hover': 'break-word' },
  },
  heightAuto: {
    height: 'auto !important',
  },
  height: (height: number) => ({ height }),
  heightHoverAuto: (height: number) => ({
    height: { default: height, ':hover': 'auto !important' },
  }),
  minHeightHover: (minHeight: number) => ({
    minHeight: { default: null, ':hover': minHeight },
  }),
  hoverShadow: {
    boxShadow: { default: null, ':hover': `0 0 2px ${colors['--gf-colors-primary-main']}` },
  },
  colorInherit: {
    color: 'inherit',
  },
  color: (color: string) => ({ color }),
  // The hover `background` shorthand also reset `background-clip` to `border-box`.
  background: (color: string | null, image: string | null, hoverColor: string | null, hoverImage: string | null) => ({
    backgroundColor: { default: color, ':hover': hoverColor },
    backgroundImage: { default: image, ':hover': hoverImage },
    backgroundClip: { default: 'padding-box', ':hover': 'border-box' },
  }),
  backgroundHoverInherit: {
    backgroundColor: { default: null, ':hover': 'inherit' },
    backgroundImage: { default: null, ':hover': 'inherit' },
    backgroundClip: { default: 'padding-box', ':hover': 'inherit' },
  },
});
