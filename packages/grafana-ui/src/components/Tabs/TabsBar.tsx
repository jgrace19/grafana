import clsx from 'clsx';

import { tabsBarStyleProps } from './TabsBar.stylex'

import { forwardRef, type ReactNode } from 'react';



export interface Props {
  /** Children should be a single <Tab /> or an array of <Tab /> */
  children: ReactNode;
  className?: string;
  /** For hiding the bottom border (on PageHeader for example) */
  hideBorder?: boolean;
}

/**
 * A composition component for rendering a TabBar with Tabs for navigation.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-tabs--docs
 */
export const TabsBar = forwardRef<HTMLDivElement, Props>(({ children, className, hideBorder = false }, ref) => {

  return (
    <div className={clsx(tabsBarStyleProps('tabsWrapper'), hideBorder && tabsBarStyleProps('noBorder'), className)} ref={ref}>
      <div {...tabsBarStyleProps('tabs')} role="tablist">
        {children}
      </div>
    </div>
  );
});

TabsBar.displayName = 'TabsBar';
