import { mergeStylexClassName } from '@grafana/ui/unstable';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Button, type ButtonProps } from '@grafana/ui';

type Props = Omit<ButtonProps, 'variant' | 'size'>;

export const ActionButton = ({ children, className, ...restProps }: Props) => {
  return (
    <Button variant="secondary" size="xs" {...mergeStylexClassName(stylex.props(actionButtonStyles.wrapper), className)} {...restProps}>
      {children}
    </Button>
  );
};

);
