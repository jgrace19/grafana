import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { forwardRef, type ReactNode } from 'react';

import { mergeStylexClassName } from '@grafana/ui/unstable';
import { getInputStyles, Icon, type IconName, getSelectStyles, useTheme2 } from '@grafana/ui';

import { valueContainerStyles } from './ValueContainer.stylex';

export interface Props {
  children: ReactNode;
  iconName?: IconName;
}
export const ValueContainer = forwardRef<HTMLDivElement, Props>(({ children, iconName }, ref) => {
  const theme = useTheme2();
  const { prefix } = getInputStyles({ theme });
  const { multiValueContainer } = getSelectStyles(theme);

  return (
    <div
      {...mergeStylexClassName(stylex.props(valueContainerStyles.container), clsx(prefix, multiValueContainer))}
      ref={ref}
    >
      {iconName && <Icon name={iconName} size="xs" />}
      {children}
    </div>
  );
});

ValueContainer.displayName = 'ValueContainer';
