import * as stylex from '@stylexjs/stylex';

import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

/** StyleX version of the shared inspector styles in `styles.ts`. */
export const panelInspectorStyles = stylex.create({
  heading: {
    fontSize: typography['--gf-typography-body-font-size'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flexGrow: '1',
    flexShrink: '1',
    flexBasis: '0',
    minHeight: 0,
  },
  toolbar: {
    display: 'flex',
    width: '100%',
    flexGrow: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  toolbarItem: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
  content: {
    flexGrow: 1,
    height: '100%',
  },
  options: {
    paddingTop: spacing['--gf-spacing-x1'],
  },
  dataDisplayOptions: {
    flexGrow: 1,
    minWidth: '300px',
    marginRight: spacing['--gf-spacing-x1'],
  },
});
