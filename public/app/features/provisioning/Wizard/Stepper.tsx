import clsx from 'clsx';

import { Icon } from '@grafana/ui';

export interface Step<T> {
  id: T;
  name: string;
  title: string;
  submitOnNext?: boolean;
  formFields?: string[];
}

export interface Props<T extends string | number> {
  activeStep?: T;
  reportId?: string;
  visitedSteps?: T[];
  steps: Array<Step<T>>;
}

export function Stepper<T extends string | number>({ visitedSteps = [], steps, activeStep = steps[0]?.id }: Props<T>) {
  const styles = (getStyles);

  return (
    <ol {...stylex.props(stepperStyles.container)}>
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = visitedSteps.includes(step.id) && !isActive;
        const isLast = index === steps.length - 1;

        const stepTextClass = cx(styles.stepText, { ...(isActive,
         ? stylex.props(stepperStyles.activeStepText) : {}) });

        return (
          <li key={step.id} {...stylex.props(stepperStyles.stepContainer)}>
            <div {...stylex.props(stepperStyles.stepContent)}>
              {isCompleted ? (
                <div {...mergeStylexClassName(stylex.props(stepperStyles.stepNumber, , styles.completedStepNumber), undefined)}>
                  <Icon name="check" size="sm" />
                </div>
              ) : (
                <div {...stylex.props(stepperStyles.stepNumber)}>{index + 1}</div>
              )}
              <div className={stepTextClass}>{step.name}</div>
            </div>
            {!isLast && <div {...stylex.props(stepperStyles.connector)} />}
          </li>
        );
      })}
    </ol>
  );
}

;
