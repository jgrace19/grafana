import * as stylex from '@stylexjs/stylex';

import { type ThemeSpacingTokens } from '@grafana/data';

import { colors } from '../../themes/stylex/tokens.stylex';
import { spacingValue } from '../Layout/utils/responsiveStylex';

interface DividerProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: ThemeSpacingTokens;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-divider--docs
 */
export const Divider = ({ direction = 'horizontal', spacing = 2 }: DividerProps) => {
  if (direction === 'vertical') {
    return <div {...stylex.props(styles.verticalDivider, styles.horizontalMargin(spacingValue(spacing)))}></div>;
  } else {
    return <hr {...stylex.props(styles.horizontalDivider, styles.verticalMargin(spacingValue(spacing)))} />;
  }
};

Divider.displayName = 'Divider';

const styles = stylex.create({
  horizontalDivider: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    width: '100%',
  },
  verticalDivider: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    height: '100%',
  },
  verticalMargin: (margin: string) => ({
    marginTop: margin,
    marginRight: 0,
    marginBottom: margin,
    marginLeft: 0,
  }),
  horizontalMargin: (margin: string) => ({
    marginTop: 0,
    marginRight: margin,
    marginBottom: 0,
    marginLeft: margin,
  }),
});
