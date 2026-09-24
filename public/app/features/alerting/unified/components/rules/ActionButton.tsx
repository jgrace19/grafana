import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';

import { Button, type ButtonProps } from '@grafana/ui';
import { typography } from '@grafana/ui/stylex/tokens.stylex';

type Props = Omit<ButtonProps, 'variant' | 'size'>;

export const ActionButton = ({ children, className, ...restProps }: Props) => {
  return (
    <Button
      variant="secondary"
      size="xs"
      className={clsx(stylex.props(styles.wrapper).className, className)}
      {...restProps}
    >
      {children}
    </Button>
  );
};

const styles = stylex.create({
  wrapper: {
    height: '24px',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
