import * as stylex from '@stylexjs/stylex';
import React, { type HTMLAttributes } from 'react';

import { selectors } from '@grafana/e2e-selectors';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { typography } from '../../themes/stylex/tokens.stylex';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const VizTooltipWrapper = ({ children, className }: Props) => {
  return (
    <div
      {...mergeStylexProps(stylex.props(styles.wrapper), { className })}
      data-testid={selectors.components.Panels.Visualization.Tooltip.Wrapper}
    >
      {children}
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
