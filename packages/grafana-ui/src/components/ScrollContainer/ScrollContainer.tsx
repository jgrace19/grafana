import * as stylex from '@stylexjs/stylex';
import { type Property } from 'csstype';
import { forwardRef, type PropsWithChildren, type UIEventHandler } from 'react';

import { Box, type BoxProps } from '../Layout/Box/Box';

import { ScrollIndicators } from './ScrollIndicators';

interface Props extends Omit<BoxProps, 'display' | 'direction' | 'element' | 'flex' | 'position'> {
  showScrollIndicators?: boolean;
  onScroll?: UIEventHandler<HTMLDivElement>;
  overflowX?: Property.OverflowX;
  overflowY?: Property.OverflowY;
  scrollbarWidth?: Property.ScrollbarWidth;
}

/**
 * This component is used to create a scrollable container. It uses native scrollbars, has an option to show scroll indicators, and supports most `Box` properties.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-scrollcontainer--docs
 */
export const ScrollContainer = forwardRef<HTMLDivElement | null, PropsWithChildren<Props>>(
  (
    {
      children,
      showScrollIndicators = false,
      onScroll,
      overflowX = 'auto',
      overflowY = 'auto',
      scrollbarWidth = 'thin',
      ...rest
    },
    ref
  ) => {
    const defaults: Partial<BoxProps> = {
      maxHeight: '100%',
      minHeight: 0,
      minWidth: 0,
    };
    const boxProps = { ...defaults, ...rest };
    const scrollerProps = stylex.props(
      styles.scroller,
      hasStyle(overflowXStyles, overflowX) && overflowXStyles[overflowX],
      hasStyle(overflowYStyles, overflowY) && overflowYStyles[overflowY],
      hasStyle(scrollbarWidthStyles, scrollbarWidth) && scrollbarWidthStyles[scrollbarWidth]
    );

    return (
      <Box {...boxProps} display="flex" direction="column" flex={1} position="relative">
        {/* scrollable containers need tabindex set so keyboard users can focus them to scroll */}
        {/* see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/a7d1a12a6198d546c4a06477b385b4fde03b762e/docs/rules/no-noninteractive-tabindex.md#:~:text=If%20you%20know,scroll%20containers%22. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div tabIndex={0} onScroll={onScroll} {...scrollerProps} ref={ref}>
          {showScrollIndicators ? <ScrollIndicators>{children}</ScrollIndicators> : children}
        </div>
      </Box>
    );
  }
);
ScrollContainer.displayName = 'ScrollContainer';

/** Values StyleX rejects (`-moz-*`, `revert-layer`) have no namespace and set nothing. */
function hasStyle<T extends object>(styles: T, value: PropertyKey): value is keyof T {
  return Object.hasOwn(styles, value);
}

const styles = stylex.create({
  scroller: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
  },
});

// One namespace per csstype value: CSS-wide keywords can't go through dynamic styles.
const overflowXStyles = stylex.create({
  auto: { overflowX: 'auto' },
  clip: { overflowX: 'clip' },
  hidden: { overflowX: 'hidden' },
  scroll: { overflowX: 'scroll' },
  visible: { overflowX: 'visible' },
  inherit: { overflowX: 'inherit' },
  initial: { overflowX: 'initial' },
  revert: { overflowX: 'revert' },
  unset: { overflowX: 'unset' },
});

const overflowYStyles = stylex.create({
  auto: { overflowY: 'auto' },
  clip: { overflowY: 'clip' },
  hidden: { overflowY: 'hidden' },
  scroll: { overflowY: 'scroll' },
  visible: { overflowY: 'visible' },
  inherit: { overflowY: 'inherit' },
  initial: { overflowY: 'initial' },
  revert: { overflowY: 'revert' },
  unset: { overflowY: 'unset' },
});

const scrollbarWidthStyles = stylex.create({
  auto: { scrollbarWidth: 'auto' },
  none: { scrollbarWidth: 'none' },
  thin: { scrollbarWidth: 'thin' },
  inherit: { scrollbarWidth: 'inherit' },
  initial: { scrollbarWidth: 'initial' },
  revert: { scrollbarWidth: 'revert' },
  unset: { scrollbarWidth: 'unset' },
});
