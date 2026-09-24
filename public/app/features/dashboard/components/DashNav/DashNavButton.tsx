// Libraries
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashNavButtonStyles } from './DashNavButton.stylex';
import { type MouseEvent } from 'react';
import * as React from 'react';

// Components
import { type IconName, type IconType, type IconSize, IconButton, useStyles2 } from '@grafana/ui';

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
    <div {...stylex.props(dashNavButtonStyles.noBorderContainer)}>
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

