import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { collapsibleSectionStyles } from './CollapsibleSection.stylex';
import { useState } from 'react';
import * as React from 'react';

import { type IconSize } from '@grafana/ui';

import { CollapseToggle } from '../../CollapseToggle';

interface Props {
  label: string;
  description?: string;
  className?: string;
  size?: IconSize;
}

export const CollapsibleSection = ({
  label,
  description,
  children,
  className,
  size = 'xl',
}: React.PropsWithChildren<Props>) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div {...mergeStylexClassName(stylex.props(collapsibleSectionStyles.wrapper), className)}>
      <CollapseToggle
        {...stylex.props(collapsibleSectionStyles.toggle)}
        size={size}
        onToggle={toggleCollapse}
        isCollapsed={isCollapsed}
        text={label}
      />
      {description && <p {...stylex.props(collapsibleSectionStyles.description)}>{description}</p>}
      <div className={isCollapsed ? collapsibleSectionStyles.hidden : collapsibleSectionStyles.content}>{children}</div>
    </div>
  );
};

