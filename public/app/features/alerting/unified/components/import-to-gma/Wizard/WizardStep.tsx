import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { wizardStepStyles } from './WizardStep.stylex';
import { type ReactNode } from 'react';

import { FieldSet, Stack } from '@grafana/ui';

import { CancelButton } from './CancelButton';
import { NextButton } from './NextButton';
import { PreviousButton } from './PreviousButton';
import { useStepperState } from './StepperState';
import { type StepKey } from './types';

interface WizardStepProps {
  /** Step identifier */
  stepId: StepKey;
  /** Step title displayed in the header */
  label: string;
  /** Optional subtitle/description */
  subHeader?: ReactNode;
  /** Step content */
  children: ReactNode;
  /** Whether this step can be skipped */
  canSkip?: boolean;
  /** Custom label for skip button */
  skipLabel?: string;
  /** Handler called when Next is clicked - should return true to proceed */
  onNext?: () => boolean | Promise<boolean>;
  /** Handler called when Skip is clicked */
  onSkip?: () => void;
  /** Handler called when Previous is clicked */
  onBack?: () => void;
  /** Disable the next button */
  disableNext?: boolean;
  /** Handler called when the wizard is cancelled */
  onCancel?: () => void;
}

/**
 * WizardStep - wrapper component for each step in the wizard
 *
 * Provides consistent layout with:
 * - Step title (FieldSet label)
 * - Optional description
 * - Step content
 * - Navigation buttons (Previous, Next/Skip, Cancel)
 */
export const WizardStep = ({
  stepId,
  label,
  subHeader,
  children,
  canSkip = false,
  skipLabel,
  onNext,
  onSkip,
  onBack,
  disableNext = false,
  onCancel,
}: WizardStepProps) => {
  const { setVisitedStep, setStepCompleted, setStepSkipped } = useStepperState();

  const handleNext = async () => {
    // If onNext is provided, call it and only proceed if it returns true
    if (onNext) {
      const shouldProceed = await onNext();
      if (!shouldProceed) {
        return false;
      }
    }

    setVisitedStep(stepId);
    setStepCompleted(stepId, true);
    setStepSkipped(stepId, false);
    return true;
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    setVisitedStep(stepId);
    setStepCompleted(stepId, false);
    setStepSkipped(stepId, true);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <FieldSet label={label} {...stylex.props(wizardStepStyles.fieldSet)}>
      {subHeader && <div {...stylex.props(wizardStepStyles.subHeader)}>{subHeader}</div>}
      <div {...stylex.props(wizardStepStyles.content)}>{children}</div>
      <div {...stylex.props(wizardStepStyles.actions)}>
        <Stack direction="row" gap={1}>
          <PreviousButton onBack={handleBack} />
          <NextButton
            onNext={handleNext}
            canSkip={canSkip}
            skipLabel={skipLabel}
            onSkip={handleSkip}
            disabled={disableNext}
          />
        </Stack>
        <CancelButton onCancel={onCancel} />
      </div>
    </FieldSet>
  );
};

