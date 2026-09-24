import * as stylex from '@stylexjs/stylex';

import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { colors, shadows, shape, spacing, typography } from '../../../themes/stylex/tokens.stylex';

const SWATCHES = ['primary', 'success', 'warning', 'error'] as const;

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--grafana-spacing-1'],
    padding: spacing['--grafana-spacing-2'],
    backgroundColor: colors['--grafana-colors-background-secondary'],
    color: colors['--grafana-colors-text-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--grafana-colors-border-weak'],
    borderRadius: shape['--grafana-shape-radius-default'],
    boxShadow: shadows['--grafana-shadows-z1'],
    fontFamily: typography['--grafana-typography-font-family'],
    fontSize: typography['--grafana-typography-body-font-size'],
  },
  caption: {
    color: colors['--grafana-colors-text-secondary'],
    fontSize: typography['--grafana-typography-body-small-font-size'],
  },
  swatches: {
    display: 'flex',
    gap: spacing['--grafana-spacing-1'],
  },
  swatch: {
    paddingBlock: spacing['--grafana-spacing-0-5'],
    paddingInline: spacing['--grafana-spacing-1'],
    borderRadius: shape['--grafana-shape-radius-sm'],
  },
  primary: {
    backgroundColor: colors['--grafana-colors-primary-main'],
    color: colors['--grafana-colors-primary-contrast-text'],
  },
  success: {
    backgroundColor: colors['--grafana-colors-success-main'],
    color: colors['--grafana-colors-success-contrast-text'],
  },
  warning: {
    backgroundColor: colors['--grafana-colors-warning-main'],
    color: colors['--grafana-colors-warning-contrast-text'],
  },
  error: {
    backgroundColor: colors['--grafana-colors-error-main'],
    color: colors['--grafana-colors-error-contrast-text'],
  },
});

/** Smoke fixture proving StyleX classes resolve against the active GrafanaTheme2 via the CSS variable bridge. */
export const StyleXThemeFixture = ({
  className,
  title = 'StyleX theme bridge',
}: {
  className?: string;
  title?: string;
}) => (
  <div data-testid="stylex-theme-fixture" {...mergeStylexProps(stylex.props(styles.card), className)}>
    <strong>{title}</strong>
    <span data-testid="stylex-theme-fixture-caption" {...stylex.props(styles.caption)}>
      Colors, spacing, radius, shadow and typography come from --grafana-* variables
    </span>
    <div {...stylex.props(styles.swatches)}>
      {SWATCHES.map((name) => (
        <span key={name} data-testid={`stylex-swatch-${name}`} {...stylex.props(styles.swatch, styles[name])}>
          {name}
        </span>
      ))}
    </div>
  </div>
);
