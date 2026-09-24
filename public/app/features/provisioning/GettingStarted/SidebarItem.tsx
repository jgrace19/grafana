// eslint-disable-next-line no-restricted-imports -- stylex: pending Card xstyle
import { css, cx } from '@emotion/css';

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
    <Card
      noMargin
      className={cx(cardStyles.stepItem, isCurrent && cardStyles.activeStep, cardStyles.plainCard)}
      onClick={handleClick}
    >
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

// stylex: pending Card xstyle. Card is StyleX but only takes className, and only an (unlayered) Emotion class
// reliably overrides Card's padding and background.
const cardStyles = {
  stepItem: css({
    padding: spacing['--gf-spacing-x1'],
    cursor: 'pointer',
    '&:hover': {
      background: colors['--gf-colors-action-hover'],
    },
  }),
  activeStep: css({
    color: colors['--gf-colors-primary-text'],
  }),
  plainCard: css({
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
  }),
};
