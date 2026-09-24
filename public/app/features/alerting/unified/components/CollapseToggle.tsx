import type { StyleXStyles } from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';

import { Button, type IconSize } from '@grafana/ui';

interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  isCollapsed: boolean;
  onToggle: (isCollapsed: boolean) => void;
  // Todo: this should be made compulsory for a11y purposes
  idControlled?: string;
  size?: IconSize;
  className?: string;
  xstyle?: StyleXStyles;
  text?: string;
}

export const CollapseToggle = ({
  isCollapsed,
  onToggle,
  idControlled,
  className,
  xstyle,
  text,
  size = 'xl',
  ...restOfProps
}: Props) => {
  return (
    <Button
      type="button"
      fill="text"
      variant="secondary"
      aria-expanded={!isCollapsed}
      aria-controls={idControlled}
      className={className}
      xstyle={xstyle}
      icon={isCollapsed ? 'angle-right' : 'angle-down'}
      onClick={() => onToggle(!isCollapsed)}
      {...restOfProps}
    >
      {text}
    </Button>
  );
};
