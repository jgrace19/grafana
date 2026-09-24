import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { listNewButtonStyles } from './ListNewButton.stylex';
import { type ButtonHTMLAttributes } from 'react';

import { Button, useStyles2 } from '@grafana/ui';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ListNewButton = ({ children, ...restProps }: Props) => {
  return (
    <div {...stylex.props(listNewButtonStyles.buttonWrapper)}>
      <Button icon="plus" {...restProps}>
        {children}
      </Button>
    </div>
  );
};

