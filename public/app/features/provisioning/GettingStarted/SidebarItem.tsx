
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sidebarItemStyles } from './SidebarItem.stylex';
import { t } from '@grafana/i18n';
import { IconButton, Text, Stack, Card } from '@grafana/ui';

export interface Props {
  step: string;
  index: number;
  currentStep: number;
  onStepClick: (index: number) => void;
  styles: ReturnType<typeof getStyles>;
}

export const SidebarItem = ({ step, index, currentStep, onStepClick, styles }: Props) => {
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
      className={`${mergeStylexClassName(stylex.props(sidebarItemStyles.stepItem), undefined).className} ${isCurrent ? mergeStylexClassName(stylex.props(sidebarItemStyles.activeStep), undefined).className : ''} ${mergeStylexClassName(stylex.props(sidebarItemStyles.plainCard), undefined).className}`}
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

export 