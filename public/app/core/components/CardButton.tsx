import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { cardButtonStyles } from './CardButton.stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';

import { Icon, type IconName } from '@grafana/ui';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  onClick: () => void;
  children: React.ReactNode;
}

export const CardButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon, children, onClick, ...restProps }, ref) => {

    return (
      <button {...restProps} {...stylex.props(cardButtonStyles.action)} onClick={onClick}>
        <Icon name={icon} size="xl" />
        {children}
      </button>
    );
  }
);

CardButton.displayName = 'CardButton';

