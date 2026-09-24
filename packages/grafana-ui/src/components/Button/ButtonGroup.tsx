import clsx from 'clsx';

import { buttonGroupStyleProps } from './ButtonGroup.stylex'

import { forwardRef, type HTMLAttributes } from 'react';



export interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const ButtonGroup = forwardRef<HTMLDivElement, Props>(({ className, children, ...rest }, ref) => {

  return (
    <div ref={ref} className={clsx('button-group', buttonGroupStyleProps('wrapper'), className)} {...rest}>
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

