import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { shape } from '../../themes/stylex/tokens.stylex';

import './ButtonGroup.css';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const ButtonGroup = forwardRef<HTMLDivElement, Props>(({ className, style, children, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      {...mergeStylexProps(stylex.props(styles.wrapper), {
        className: clsx('button-group', 'gf-button-group', className),
        style,
      })}
      {...rest}
    >
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

// Child buttons are styled by ButtonGroup.css.
const styles = stylex.create({
  wrapper: {
    display: 'flex',
    borderRadius: shape['--gf-shape-radius-default'],
  },
});
