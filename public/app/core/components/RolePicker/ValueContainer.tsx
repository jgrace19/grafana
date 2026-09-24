import * as stylex from '@stylexjs/stylex';
import { forwardRef, type ReactNode } from 'react';

import { Icon, type IconName, useTheme2 } from '@grafana/ui';
import { inputStyles } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  children: ReactNode;
  iconName?: IconName;
}
export const ValueContainer = forwardRef<HTMLDivElement, Props>(({ children, iconName }, ref) => {
  const theme = useTheme2();
  const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary);

  return (
    <div
      {...stylex.props(
        inputStyles.prefixSuffix,
        inputStyles.prefix,
        styles.container,
        styles.hoverBackground(hoverBackground)
      )}
      ref={ref}
    >
      {iconName && <Icon name={iconName} size="xs" xstyle={styles.icon} />}
      {children}
    </div>
  );
});

ValueContainer.displayName = 'ValueContainer';

// Input's prefix look, overridden by Select's multi-value chip (as the Emotion prefix + multiValueContainer merge
// resolved it).
const styles = stylex.create({
  container: {
    position: 'relative',
    lineHeight: 1,
    borderRadius: shape['--gf-shape-radius-sm'],
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    marginLeft: 0,
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    color: colors['--gf-colors-text-primary'],
    fontSize: typography['--gf-typography-size-sm'],
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  hoverBackground: (hover: string) => ({
    backgroundColor: { default: colors['--gf-colors-background-secondary'], ':hover': hover },
  }),
  icon: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
});
