import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const stylesStyles = stylex.create({
  table: {
    width: '100%',
        tableLayout: 'fixed',
        overflow: 'scroll',
  },
  scrollableTable: {
    overflow: 'auto',
  },
  tableScroller: {
    maxHeight: '35vh',
  },
  selectedTableScroller: {
    maxHeight: '35vh',
  },
  header: {
    background: grafanaTokens.colors_background_secondary,
  },
  row: {
    borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        '&:last-of-type': {
          borderBottomColor: grafanaTokens.colors_border_medium,
        },
  },
  disabledRow: {
    opacity: 0.5,
  },
  cell: {
    padding: themeSpacingShorthand(1, 1, 1, 0),
        width: '25%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&:first-of-type': {
          width: '50%',
          padding: themeSpacingShorthand(1, 1, 1, 2),
        },
  },
  collapseButton: {
    margin: 0
  },
  loadingCell: {
    textAlign: 'center',
  },
  spinner: {
    marginBottom: 0,
  },
  nestedEntry: {
    display: 'flex',
        alignItems: 'center',
  },
  entryContentItem: {
    margin: themeSpacingShorthand(0, 1, 0, 0),
  },
  truncated: {
    minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
  },
  resourceField: {
    maxWidth: themeSpacing(36),
        overflow: 'hidden',
  },
  resourceFieldButton: {
    padding: '7px',
        textAlign: 'left',
  },
  nestedRowCheckbox: {
    zIndex: 0,
  },
  selectionFooter: {
    background: grafanaTokens.colors_background_primary,
        paddingTop: themeSpacing(2),
  },
  loadingWrapper: {
    textAlign: 'center',
        paddingTop: themeSpacing(2),
        paddingBottom: themeSpacing(2),
        color: grafanaTokens.colors_text_secondary,
  },
  resultLimit: {
    margin: '4px 0',
        fontStyle: 'italic',
  },
  modal: {
    width: theme.breakpoints.values.lg,
        maxHeight: '80vh',
  },
});
