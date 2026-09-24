// Libraries
import * as stylex from '@stylexjs/stylex';
import { type MouseEvent } from 'react';
import * as React from 'react';

// Components
import { type IconName, type IconType, type IconSize, IconButton } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  icon?: IconName;
  tooltip: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  children?: React.ReactNode;
  iconType?: IconType;
  iconSize?: IconSize;
}

export const DashNavButton = ({ icon, iconType, iconSize, tooltip, onClick, children }: Props) => {
  return (
    <div {...stylex.props(styles.noBorderContainer)}>
      {icon && (
        <IconButton
          name={icon}
          size={iconSize}
          iconType={iconType}
          tooltip={tooltip}
          tooltipPlacement="bottom"
          onClick={onClick}
        />
      )}
      {children}
    </div>
  );
};

const styles = stylex.create({
  noBorderContainer: {
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    display: 'flex',
  },
});
