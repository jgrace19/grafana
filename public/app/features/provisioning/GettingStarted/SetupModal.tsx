import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { setupModalStyles } from './SetupModal.stylex';
import { useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Modal, Button, Stack, Text } from '@grafana/ui';

import { SetupStep } from './SetupStep';
import { Sidebar } from './Sidebar';
import { type Step } from './types';

export interface Props {
  title: string;
  description: string;
  steps: Step[];

  isOpen: boolean;
  onDismiss: () => void;
}

export const SetupModal = ({ title, description, steps, isOpen, onDismiss }: Props) => {

  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const stepTitles = steps.map((step) => step.title);

  const handleNext = () => !isLastStep && setCurrentStep(currentStep + 1);
  const handlePrevious = () => !isFirstStep && setCurrentStep(currentStep - 1);

  return (
    <Modal isOpen={isOpen} title={title} onDismiss={onDismiss} {...stylex.props(setupModalStyles.modal)}>
      <Stack direction={'column'} gap={4}>
        <Text variant="body" color="secondary">
          {description}
        </Text>
        <Stack direction="row" height="100%">
          <Sidebar steps={stepTitles} currentStep={currentStep} onStepClick={setCurrentStep} />

          <div {...stylex.props(setupModalStyles.contentWrapper)}>
            <SetupStep step={steps[currentStep]} />
          </div>
        </Stack>
      </Stack>

      <Modal.ButtonRow>
        <Stack direction="row" justifyContent="flex-end" gap={2}>
          <Button variant="secondary" onClick={handlePrevious} disabled={isFirstStep}>
            <Trans i18nKey="provisioning.setup-modal.previous">Previous</Trans>
          </Button>

          {isLastStep ? (
            <Button variant="primary" onClick={onDismiss} icon="check-circle">
              <Trans i18nKey="provisioning.setup-modal.done">Done</Trans>
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              <Trans i18nKey="provisioning.setup-modal.next">Next</Trans>
            </Button>
          )}
        </Stack>
      </Modal.ButtonRow>
    </Modal>
  );
};

