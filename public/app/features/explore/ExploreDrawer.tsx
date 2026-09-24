// Libraries
import * as stylex from '@stylexjs/stylex';
import { Resizable, type ResizeCallback } from 're-resizable';
import * as React from 'react';

// Services & Utils
import { useTheme2 } from '@grafana/ui';
import { getDragHandleClassNames } from '@grafana/ui/internal';
import { motion, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, shadows } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  children: React.ReactNode;
  onResize?: ResizeCallback;
  initialHeight?: string;
}

export function ExploreDrawer(props: Props) {
  const { children, onResize, initialHeight } = props;
  const theme = useTheme2();
  const dragStyles = getDragHandleClassNames();

  const height = initialHeight || `${theme.components.horizontalDrawer.defaultHeight}px`;

  return (
    <Resizable
      className={stylex.props(styles.container, styles.drawerActive).className}
      // Resizable writes `position: relative` inline; its style prop is merged over that.
      style={{ position: 'absolute' }}
      defaultSize={{ width: '100%', height }}
      handleClasses={{ top: dragStyles.dragHandleHorizontal }}
      enable={{
        top: true,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      maxHeight="100vh"
      onResize={onResize}
    >
      {children}
    </Resizable>
  );
}

const drawerSlide = stylex.keyframes({
  '0%': {
    transform: `translateY(calc(${components['--gf-components-horizontal-drawer-default-height']} * 1px))`,
  },
  '100%': {
    transform: 'translateY(0px)',
  },
});

const styles = stylex.create({
  container: {
    bottom: 0,
    backgroundColor: colors['--gf-colors-background-primary'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z3'],
    zIndex: zIndex.navbarFixed,
  },
  drawerActive: {
    opacity: 1,
    animationName: { default: null, [motion.noPreference]: drawerSlide },
    animationDuration: { default: null, [motion.noPreference]: '0.5s' },
    animationTimingFunction: { default: null, [motion.noPreference]: 'ease-out' },
  },
});
