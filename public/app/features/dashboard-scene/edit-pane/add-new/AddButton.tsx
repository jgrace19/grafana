import { type IconName } from '@grafana/data';
import { Button } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';

import './AddButton.css';

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
      className={mergeStylexProps({ className: 'gf-add-button' }, { className }).className}
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
