import * as stylex from '@stylexjs/stylex';

import { Icon } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { useStepperState } from './StepperState';
import { getWizardSteps } from './constants';
import { type StepKey, StepState } from './types';

/**
 * Stepper component - sidebar navigation for the wizard
 * - Completed without errors: green check icon
 * - Completed with errors/warnings: yellow warning icon
 * - Skipped: minus icon
 * - Pending: number
 */
export const Stepper = () => {
  const { activeStep, setActiveStep, setVisitedStep, visitedSteps, isStepCompleted, isStepSkipped, hasStepErrors } =
    useStepperState();

  const steps = getWizardSteps();
  const lastStep = steps[steps.length - 1];

  const handleStepClick = (stepId: StepKey) => {
    // Mark current step as visited before navigating
    setVisitedStep(activeStep);
    setActiveStep(stepId);
  };

  const canNavigateToStep = (stepId: StepKey): boolean => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const activeIndex = steps.findIndex((s) => s.id === activeStep);

    // Can always go back to previous steps
    if (stepIndex <= activeIndex) {
      return true;
    }

    // Can only go forward if all previous steps are completed or skipped
    for (let i = 0; i < stepIndex; i++) {
      const step = steps[i];
      if (!isStepCompleted(step.id) && !isStepSkipped(step.id)) {
        return false;
      }
    }
    return true;
  };

  return (
    <ol {...stylex.props(styles.container)}>
      {steps.map((step, index) => {
        const isLast = step.id === lastStep.id;
        const isActive = step.id === activeStep;
        const isVisited = visitedSteps[step.id] === StepState.Visited;
        const isCompleted = isStepCompleted(step.id);
        const isSkipped = isStepSkipped(step.id);
        const hasErrors = hasStepErrors(step.id);
        const canNavigate = canNavigateToStep(step.id);

        // Determine visual state
        // - Warning: visited, not current, not last, has validation errors
        // - Success: visited, not current, not last, completed without errors
        // - Skipped: skipped and not active
        const showWarning = isVisited && !isActive && !isLast && hasErrors;
        const showSuccess = isVisited && !isActive && !isLast && isCompleted && !hasErrors && !isSkipped;
        const showSkipped = isSkipped && !isActive;
        const showNumber = !showWarning && !showSuccess && !showSkipped;

        return (
          <li key={step.id} {...stylex.props(styles.item, isActive && styles.active)}>
            <button
              type="button"
              {...stylex.props(styles.stepButton, !canNavigate && styles.stepButtonDisabled)}
              onClick={() => handleStepClick(step.id)}
              disabled={!canNavigate}
            >
              <span {...stylex.props(styles.indicator)}>
                {showWarning && <Icon name="exclamation-triangle" xstyle={styles.warningIcon} />}
                {showSuccess && <Icon name="check" xstyle={styles.successIcon} />}
                {showSkipped && <Icon name="minus" xstyle={styles.skippedIcon} />}
                {showNumber && <span>{index + 1}</span>}
              </span>
              <span>{step.name}</span>
            </button>
            {!isLast && <div {...stylex.props(styles.divider)} />}
          </li>
        );
      })}
    </ol>
  );
};

const styles = stylex.create({
  container: {
    listStyle: 'none',
    margin: 0,
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x4'],
    paddingBottom: 0,
    paddingLeft: 0,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    minWidth: '220px',
  },
  item: {
    position: 'relative',
    color: colors['--gf-colors-text-secondary'],
  },
  active: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-max-contrast'],
  },
  stepButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
    backgroundColor: 'transparent',
    borderStyle: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    color: { default: 'inherit', ':hover': colors['--gf-colors-text-link'] },
    fontWeight: 'inherit',
    fontSize: typography['--gf-typography-body-font-size'],
    width: '100%',
  },
  // Only applied to disabled buttons, which never get the link colour on hover.
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    color: 'inherit',
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing['--gf-spacing-x2'],
    flexShrink: 0,
  },
  warningIcon: {
    color: colors['--gf-colors-warning-text'],
  },
  successIcon: {
    color: colors['--gf-colors-success-text'],
  },
  skippedIcon: {
    color: colors['--gf-colors-text-secondary'],
  },
  divider: {
    height: spacing['--gf-spacing-x2'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'dotted',
    borderLeftColor: colors['--gf-colors-text-secondary'],
    marginLeft: spacing['--gf-spacing-x1'],
  },
});
