import * as stylex from '@stylexjs/stylex';

import { type IconName } from '@grafana/data';
import { Button } from '@grafana/ui';
import { colors, shadows, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      className={className}
      xstyle={styles.button}
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

const styles = stylex.create({
  // Over Button's secondary outline look: the :hover background and shadow came after its focus and active rules;
  // its mouse-focus reset and disabled look still win.
  button: {
    display: 'flex',
    paddingTop: spacing['--gf-spacing-x1-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x1-5'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    gap: spacing['--gf-spacing-x1-5'],
    alignItems: 'center',
    fontSize: '14px',
    backgroundColor: {
      default: 'transparent',
      ':disabled': 'transparent',
      ':hover': { default: colors['--gf-colors-background-elevated'], ':disabled': 'transparent' },
      ':focus': {
        default: colors['--gf-colors-secondary-transparent'],
        ':hover': colors['--gf-colors-background-elevated'],
      },
      ':active': { default: 'transparent', ':hover': colors['--gf-colors-background-elevated'] },
    },
    boxShadow: {
      default: null,
      ':disabled': 'none',
      ':focus-visible': `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
      ':hover': { default: shadows['--gf-shadows-z1'], ':disabled': 'none' },
      ':focus': {
        default: `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
        ':hover': { default: shadows['--gf-shadows-z1'], ':not(:focus-visible)': 'none' },
        ':not(:focus-visible)': 'none',
      },
    },
  },
});
