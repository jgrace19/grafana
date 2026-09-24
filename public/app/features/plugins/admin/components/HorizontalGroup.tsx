import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import * as React from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';

import './HorizontalGroup.css';

interface HorizontalGroupProps {
  children: React.ReactNode;
  wrap?: boolean;
  className?: string;
  xstyle?: StyleXStyles;
}

export const HorizontalGroup = ({ children, wrap, className, xstyle }: HorizontalGroupProps) => {
  return (
    <div
      {...mergeStylexProps(stylex.props(styles.container, wrap && styles.wrap, xstyle), {
        className: [
          'gf-plugins-horizontal-group',
          (className || xstyle) && 'gf-plugins-horizontal-group-override',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      })}
    >
      {children}
    </div>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  wrap: {
    flexWrap: 'wrap',
  },
});
