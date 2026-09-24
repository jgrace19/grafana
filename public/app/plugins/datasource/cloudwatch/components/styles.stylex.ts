import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const stylesStyles = stylex.create({
  table: {
    width: '100%',
        tableLayout: 'fixed',
  },
  selectedLogGroupsContainer: {
    marginLeft: themeSpacing(0.5),
        display: 'flex',
        flexFlow: 'wrap',
        gap: themeSpacing(1),
        button: {
          margin: 'unset',
        },
  },
  limitLabel: {
    color: grafanaTokens.colors_text_secondary,
        textAlign: 'center',
        maxWidth: 'none',
        svg: {
          marginRight: themeSpacing(0.5),
        },
        fontSize: 12,
  },
  logGroupCountLabel: {
    color: grafanaTokens.colors_text_secondary,
        maxWidth: 'none',
  },
  tableScroller: {
    maxHeight: '40vh',
        overflow: 'auto',
  },
  row: {
    borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        '&:last-of-type': {
          borderBottomColor: grafanaTokens.colors_border_medium,
        },
  },
  cell: {
    padding: themeSpacingShorthand(1, 1, 1, 0),
        width: '25%',
        '&:first-of-type': {
          width: '80%',
          padding: themeSpacingShorthand(1, 1, 1, 2),
        },
  },
  nestedEntry: {
    display: 'flex',
        alignItems: 'center',
  },
  logGroupSearchResults: {
    overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '90%',
        verticalAlign: 'middle',
  },
  modal: {
    width: theme.breakpoints.values.lg,
  },
  selectAccountId: {
    maxWidth: '100px',
  },
  logGroupSelectionArea: {
    display: 'flex',
  },
  searchField: {
    width: '100%',
        marginRight: themeSpacing(1),
  },
  resultLimit: {
    margin: '4px 0',
        fontStyle: 'italic',
  },
  removeButton: {
    verticalAlign: 'middle',
        marginLeft: themeSpacing(0.5),
  },
});
