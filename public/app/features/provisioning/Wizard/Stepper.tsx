import * as stylex from '@stylexjs/stylex';

import { Icon } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
  return (
    <ol {...stylex.props(styles.container)}>
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = visitedSteps.includes(step.id) && !isActive;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} {...stylex.props(styles.stepContainer)}>
            <div {...stylex.props(styles.stepContent)}>
              {isCompleted ? (
                <div {...stylex.props(styles.stepNumber, styles.completedStepNumber)}>
                  <Icon name="check" size="sm" />
                </div>
              ) : (
                <div {...stylex.props(styles.stepNumber)}>{index + 1}</div>
              )}
              <div {...stylex.props(styles.stepText, isActive && styles.activeStepText)}>{step.name}</div>
            </div>
            {!isLast && <div {...stylex.props(styles.connector)} />}
          </li>
        );
      })}
    </ol>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: spacing['--gf-spacing-x0'],
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: spacing['--gf-spacing-x0'],
    padding: 0,
    listStyle: 'none',
    width: 200,
  },

  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
  },

  stepContent: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0'],
  },

  stepNumber: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: spacing['--gf-spacing-x3'],
    width: spacing['--gf-spacing-x3'],
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    marginRight: spacing['--gf-spacing-x1'],
  },

  completedStepNumber: {
    color: colors['--gf-colors-success-main'],
  },

  stepText: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-md'],
  },

  activeStepText: {
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },

  connector: {
    width: '1px',
    backgroundColor: colors['--gf-colors-border-medium'],
    height: spacing['--gf-spacing-x2'],
    marginLeft: spacing['--gf-spacing-x1-5'],
    marginTop: spacing['--gf-spacing-x0-5'],
  },
});
