import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { colors } from '../../themes/stylex/tokens.stylex';

export interface Props {
  children?: React.ReactNode;
}

export const DashboardStoryCanvas = ({ children }: Props) => {
  return <div {...stylex.props(styles.canvas)}>{children}</div>;
};

DashboardStoryCanvas.displayName = 'DashboardStoryCanvas';

const styles = stylex.create({
  canvas: {
    width: '100%',
    height: '100%',
    padding: '32px',
    backgroundColor: colors['--gf-colors-background-canvas'],
    overflow: 'auto',
  },
});
