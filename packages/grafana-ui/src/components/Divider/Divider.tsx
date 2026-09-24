import { type ThemeSpacingTokens } from '@grafana/data';

import { dividerStyleProps } from './Divider.stylex';

interface DividerProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: ThemeSpacingTokens;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-divider--docs
 */
export const Divider = ({ direction = 'horizontal', spacing = 2 }: DividerProps) => {
  const styleProps = dividerStyleProps(direction, spacing);

  if (direction === 'vertical') {
    return <div {...styleProps} />;
  }
  return <hr {...styleProps} />;
};

Divider.displayName = 'Divider';
