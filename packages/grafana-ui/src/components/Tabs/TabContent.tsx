import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { type HTMLAttributes, type ReactNode } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors } from '../../themes/stylex/tokens.stylex';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** @internal first-party StyleX overrides */
  xstyle?: StyleXStyles;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-tabs--docs
 */
export const TabContent = ({ children, className, style, xstyle, ...restProps }: Props) => {
  return (
    <div {...restProps} {...mergeStylexProps(stylex.props(styles.tabContent, xstyle), { className, style })}>
      {children}
    </div>
  );
};

const styles = stylex.create({
  tabContent: {
    backgroundColor: colors['--gf-colors-background-primary'],
  },
});
