import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton, Text, Stack, Card } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  step: string;
  index: number;
  currentStep: number;
  onStepClick: (index: number) => void;
}

export const SidebarItem = ({ step, index, currentStep, onStepClick }: Props) => {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;
  const isPending = index > currentStep;

  const getStepStatus = () => {
    if (isCompleted) {
      return {
        icon: 'check-circle' as const,
        color: 'success',
        label: t('provisioning.sidebar-item.label-completed-step', 'Completed step'),
      };
    }
    if (isCurrent) {
      return {
        icon: 'circle' as const,
        color: 'primary',
        label: t('provisioning.sidebar-item.label-current-step', 'Current step'),
      };
    }
    return {
      icon: 'circle' as const,
      color: 'secondary',
      label: t('provisioning.sidebar-item.label-pending-step', 'Pending step'),
    };
  };

  const { icon, color, label } = getStepStatus();

  const handleClick = () => onStepClick(index);
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStepClick(index);
  };

  return (
    <Card noMargin xstyle={[cardStyles.stepItem, isCurrent && cardStyles.activeStep]} onClick={handleClick}>
      <Stack direction="row" alignItems="center" gap={2}>
        <IconButton
          name={icon}
          size="sm"
          variant={isPending ? 'secondary' : 'primary'}
          color={color}
          aria-label={label}
          onClick={handleIconClick}
        />
        <Text color={isCurrent ? 'primary' : 'secondary'} weight={isCurrent ? 'medium' : 'regular'}>
          {step}
        </Text>
      </Stack>
    </Card>
  );
};

// Card's own :focus ring still wins over `box-shadow: none`.
const cardStyles = stylex.create({
  stepItem: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    cursor: 'pointer',
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    borderStyle: 'none',
    boxShadow: {
      default: 'none',
      ':focus': `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
    },
  },
  activeStep: {
    color: colors['--gf-colors-primary-text'],
  },
});
