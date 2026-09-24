import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { addButtonStyles } from './AddButton.stylex';

import { type IconName, type GrafanaTheme2 } from '@grafana/data';
import {Button} from '@grafana/ui';

type AddButtonProps = {
  icon: IconName;
  label: string;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  tooltip?: string;
  className?: string;
  tabIndex?: number;
  // When disabled, callers should set tooltip to explain why.
  disabled?: boolean;
};

export function AddButton({ icon, label, tooltip, tabIndex, onClick, onKeyDown, className, disabled }: AddButtonProps) {

  return (
    <Button
      {...mergeStylexClassName(stylex.props(addButtonStyles.iconButton), clsx(className))}
      variant="secondary"
      fill="outline"
      size="lg"
      tabIndex={tabIndex}
      icon={icon}
      tooltip={tooltip}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}


