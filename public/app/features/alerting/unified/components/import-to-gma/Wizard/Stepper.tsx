import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { Icon } from '@grafana/ui';

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
    <ol {...stylex.props(stepperStyles.container)}>
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

        const itemStyles = cx(stylex.props(formStyles.item), {
          [stylex.props(formStyles.active)]: isActive,
        });

        return (
          <li key={step.id} className={itemStyles}>
            <button
              type="button"
              {...mergeStylexClassName(stylex.props(formStyles.stepButton), {
                [stylex.props(formStyles.stepButtonDisabled)]: !canNavigate,
              })}
              onClick={() => handleStepClick(step.id)}
              disabled={!canNavigate}
            >
              <span {...stylex.props(stepperStyles.indicator)}>
                {showWarning && <Icon name="exclamation-triangle" {...stylex.props(stepperStyles.warningIcon)} />}
                {showSuccess && <Icon name="check" {...stylex.props(stepperStyles.successIcon)} />}
                {showSkipped && <Icon name="minus" {...stylex.props(stepperStyles.skippedIcon)} />}
                {showNumber && <span>{index + 1}</span>}
              </span>
              <span {...stylex.props(stepperStyles.stepName)}>{step.name}</span>
            </button>
            {!isLast && <div {...stylex.props(stepperStyles.divider)} />}
          </li>
        );
      })}
    </ol>
  );
};

