import * as stylex from '@stylexjs/stylex';

import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

/** StyleX version of the shared library panel modal styles in `styles.ts`. */
export const modalStyles = stylex.create({
  myTable: {
    maxHeight: '204px',
    overflowY: 'auto',
    marginTop: '11px',
    marginBottom: '28px',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-action-hover'],
    backgroundColor: colors['--gf-colors-background-primary'],
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-h6-font-size'],
    width: '100%',
  },
  myTableHead: {
    color: '#538ade',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  myTableCell: {
    paddingTop: '6px',
    paddingRight: '13px',
    paddingBottom: '6px',
    paddingLeft: '13px',
    height: spacing['--gf-spacing-x4'],
  },
  myTableBodyRow: {
    backgroundColor: { default: null, ':nth-child(odd)': colors['--gf-colors-background-secondary'] },
  },
  textInfo: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
  },
  dashboardSearch: {
    marginTop: spacing['--gf-spacing-x2'],
  },
  modalText: {
    fontSize: typography['--gf-typography-h4-font-size'],
    color: colors['--gf-colors-text-primary'],
    marginBottom: spacing['--gf-spacing-x4'],
    paddingTop: spacing['--gf-spacing-x2'],
  },
});
