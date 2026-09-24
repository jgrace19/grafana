import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { horizontalGroupStyles } from './HorizontalGroup.stylex';
import * as React from 'react';

import { useTheme2 } from '@grafana/ui';

interface HorizontalGroupProps {
  children: React.ReactNode;
  wrap?: boolean;
  className?: string;
}

export const HorizontalGroup = ({ children, wrap, className }: HorizontalGroupProps) => {
  const theme = useTheme2();
  const styles = getStyles(theme, wrap);

  return <div {...mergeStylexClassName(stylex.props(horizontalGroupStyles.container, className), undefined)}>{children}</div>;
};

