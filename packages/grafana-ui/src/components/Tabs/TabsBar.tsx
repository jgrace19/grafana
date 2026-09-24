import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { forwardRef, type ReactNode } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors } from '../../themes/stylex/tokens.stylex';

export interface Props {
  /** Children should be a single <Tab /> or an array of <Tab /> */
  children: ReactNode;
  className?: string;
  /** For hiding the bottom border (on PageHeader for example) */
  hideBorder?: boolean;
  /** @internal first-party StyleX overrides */
  xstyle?: StyleXStyles;
}

/**
 * A composition component for rendering a TabBar with Tabs for navigation.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-tabs--docs
 */
export const TabsBar = forwardRef<HTMLDivElement, Props>(({ children, className, hideBorder = false, xstyle }, ref) => {
  return (
    <div
      {...mergeStylexProps(stylex.props(styles.tabsWrapper, hideBorder && styles.noBorder, xstyle), { className })}
      ref={ref}
    >
      <div {...stylex.props(styles.tabs)} role="tablist">
        {children}
      </div>
    </div>
  );
});

const styles = stylex.create({
  tabsWrapper: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    overflowX: 'auto',
  },
  noBorder: {
    borderBottomWidth: 0,
    borderBottomStyle: 'none',
    borderBottomColor: 'currentcolor',
  },
  tabs: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
});

TabsBar.displayName = 'TabsBar';
