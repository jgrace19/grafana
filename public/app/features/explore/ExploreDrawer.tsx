import clsx from 'clsx';
// Libraries
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { exploreDrawerStyles } from './ExploreDrawer.stylex';
import { Resizable, type ResizeCallback } from 're-resizable';
import * as React from 'react';

// Services & Utils
import { getDragStyles, useTheme2 } from '@grafana/ui';

export interface Props {
  children: React.ReactNode;
  onResize?: ResizeCallback;
  initialHeight?: string;
}

export function ExploreDrawer(props: Props) {
  const { children, onResize, initialHeight } = props;
  const theme = useTheme2();
  const dragStyles = getDragStyles(theme);

  const height = initialHeight || `${theme.components.horizontalDrawer.defaultHeight}px`;

  return (
    <Resizable
      {...mergeStylexClassName(stylex.props(exploreDrawerStyles.fixed, , mergeStylexClassName(stylex.props(exploreDrawerStyles.container), undefined).className, mergeStylexClassName(stylex.props(exploreDrawerStyles.drawerActive), undefined).className), undefined)}
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

const drawerSlide = (theme: GrafanaTheme2) => keyframes`
  0% {
    transform: translateY(${theme.components.horizontalDrawer.defaultHeight}px);
  }

  100% {
    transform: translateY(0px);
  }
`;

