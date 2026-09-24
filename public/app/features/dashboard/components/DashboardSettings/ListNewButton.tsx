import * as stylex from '@stylexjs/stylex';
import { type ButtonHTMLAttributes } from 'react';

import { Button } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ListNewButton = ({ children, ...restProps }: Props) => {
  return (
    <div {...stylex.props(styles.buttonWrapper)}>
      <Button icon="plus" {...restProps}>
        {children}
      </Button>
    </div>
  );
};

const styles = stylex.create({
  buttonWrapper: {
    paddingTop: spacing['--gf-spacing-x3'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x3'],
    paddingLeft: 0,
  },
});
