import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const metricsModalStyles = stylex.create({
  modal: {
    width: '85vw',
    '@media (max-width: 768px)': {
      width: '100%',
    },
    '@media (min-width: 1200px)': {
      width: '60%',
    },
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputItemFirst: {
    flexBasis: '40%',
    paddingRight: '16px',
    '@media (max-width: 768px)': {
      paddingRight: '0px',
      paddingBottom: '16px',
    },
  },
  inputItem: {
    flexGrow: 1,
    flexBasis: '20%',
    '@media (max-width: 768px)': {
      minWidth: '100%',
    },
  },
  resultsData: {
    marginTop: '4px',
    marginRight: 0,
    marginBottom: grafanaTokens.spacing_x2,
    marginLeft: 0,
  },
  resultsDataFiltered: {
    color: grafanaTokens.colors_text_secondary,
    textAlign: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(204, 204, 220, 0.25)',
    padding: '7px',
  },
  resultsDataFilteredText: {
    display: 'inline',
    verticalAlign: 'text-top',
  },
  results: {
    height: 'calc(80vh - 310px)',
    overflowY: 'scroll',
  },
  resultsFooter: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    position: 'sticky',
    justifyContent: 'center',
  },
  currentlySelected: {
    color: 'grey',
    opacity: '75%',
    fontSize: '0.75rem',
  },
  loadingSpinner: {
    visibility: 'hidden',
  },
  visible: {
    visibility: 'visible',
  },
});

export const resultsTableStyles = stylex.create({
  table: {
    tableLayout: 'fixed',
    borderRadius: grafanaTokens.shape_radius_default,
    width: '100%',
    whiteSpace: 'normal',
  },
  tableCell: {
    padding: grafanaTokens.spacing_x1,
    minWidth: grafanaTokens.spacing_x3,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_border_weak,
  },
  row: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_border_weak,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: grafanaTokens.colors_background_secondary,
    },
    ':last-child': {
      borderBottomWidth: 0,
    },
  },
  tableHeaderPadding: {
    padding: '8px',
  },
  matchHighLight: {
    backgroundColor: 'inherit',
    color: grafanaTokens.colors_warning_text,
    background: grafanaTokens.colors_warning_transparent,
  },
  nameWidth: {
    width: '37.5%',
  },
  nameOverflow: {
    overflowWrap: 'anywhere',
  },
  typeWidth: {
    width: '15%',
  },
  descriptionWidth: {
    width: '35%',
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: grafanaTokens.colors_background_primary,
  },
  noResults: {
    textAlign: 'center',
    color: grafanaTokens.colors_text_secondary,
  },
  tooltipSpace: {
    marginLeft: '4px',
  },
});
