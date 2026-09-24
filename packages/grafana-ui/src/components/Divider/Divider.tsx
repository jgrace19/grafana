import * as stylex from '@stylexjs/stylex';

import { type ThemeSpacingTokens } from '@grafana/data';

import { getSpacingVariableName } from '../../themes/stylex/cssVariables';
import { colors } from '../../themes/stylex/tokens.stylex';

interface DividerProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: ThemeSpacingTokens;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-divider--docs
 */
export const Divider = ({ direction = 'horizontal', spacing = 2 }: DividerProps) => {
  const margin = `var(${getSpacingVariableName(spacing)})`;

  if (direction === 'vertical') {
    return <div {...stylex.props(styles.verticalDivider, styles.verticalMargin(margin))}></div>;
  } else {
    return <hr {...stylex.props(styles.horizontalDivider, styles.horizontalMargin(margin))} />;
  }
};

Divider.displayName = 'Divider';

const styles = stylex.create({
  horizontalDivider: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--grafana-colors-border-weak'],
    marginRight: 0,
    marginLeft: 0,
    width: '100%',
  },
  verticalDivider: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--grafana-colors-border-weak'],
    marginTop: 0,
    marginBottom: 0,
    height: '100%',
  },
  // The spacing prop picks a theme spacing token at runtime, so margins are passed through StyleX dynamic styles.
  horizontalMargin: (margin: string) => ({
    marginTop: margin,
    marginBottom: margin,
  }),
  verticalMargin: (margin: string) => ({
    marginRight: margin,
    marginLeft: margin,
  }),
});
