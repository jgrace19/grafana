import * as stylex from '@stylexjs/stylex';

import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export const receiverFormFieldStyles = stylex.create({
  collapsibleSection: {
    margin: 0,
    padding: 0,
  },
  wrapper: {
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
    padding: spacing['--gf-spacing-x1'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
  },
  description: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    margin: 0,
  },
  deleteIcon: {
    position: 'absolute',
    right: spacing['--gf-spacing-x1'],
    top: spacing['--gf-spacing-x1'],
  },
  addButton: {
    marginTop: spacing['--gf-spacing-x1'],
  },
});
