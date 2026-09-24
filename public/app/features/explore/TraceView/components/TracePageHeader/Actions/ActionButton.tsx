
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { actionButtonStyles } from './ActionButton.stylex';
import { Button, useStyles2 } from '@grafana/ui';

export 
export type ActionButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  label: string;
  icon: IconName;
};

export default function ActionButton(props: ActionButtonProps) {
  const { onClick, ariaLabel, label, icon } = props;

  return (
    <Button
      {...stylex.props(actionButtonStyles.ActionButton)}
      size="sm"
      variant="secondary"
      fill={'outline'}
      type="button"
      icon={icon}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
