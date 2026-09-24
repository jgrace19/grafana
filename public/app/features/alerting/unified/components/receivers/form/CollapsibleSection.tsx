import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';

import { type IconSize } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { CollapseToggle } from '../../CollapseToggle';

interface Props {
  label: string;
  description?: string;
  className?: string;
  xstyle?: StyleXStyles;
  size?: IconSize;
}

export const CollapsibleSection = ({
  label,
  description,
  children,
  className,
  xstyle,
  size = 'xl',
}: React.PropsWithChildren<Props>) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div {...mergeStylexProps(stylex.props(styles.wrapper, xstyle), { className })}>
      <CollapseToggle
        xstyle={styles.toggle}
        size={size}
        onToggle={toggleCollapse}
        isCollapsed={isCollapsed}
        text={label}
      />
      {description && <p {...stylex.props(styles.description)}>{description}</p>}
      <div {...stylex.props(isCollapsed ? styles.hidden : styles.content)}>{children}</div>
    </div>
  );
};

const styles = stylex.create({
  toggle: {
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  wrapper: {
    marginTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  hidden: {
    display: 'none',
  },
  description: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    margin: 0,
  },
  content: {
    paddingLeft: spacing['--gf-spacing-x3'],
  },
});
