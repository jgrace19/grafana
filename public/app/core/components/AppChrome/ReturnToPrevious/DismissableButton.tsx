import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, ButtonGroup } from '@grafana/ui';

export interface DismissableButtonProps {
  label: string;
  onClick: () => void;
  onDismiss: () => void;
}

export const DismissableButton = ({ label, onClick, onDismiss }: DismissableButtonProps) => {

  return (
    <ButtonGroup {...stylex.props(dismissableButtonStyles.buttonGroup)}>
      <Button
        icon="angle-left"
        size="sm"
        variant="primary"
        fill="outline"
        onClick={onClick}
        title={label}
        {...stylex.props(dismissableButtonStyles.mainDismissableButton)}
        data-testid={selectors.components.ReturnToPrevious.backButton}
      >
        {label}
      </Button>
      <Button
        icon="times"
        aria-label={t('return-to-previous.dismissable-button', 'Close')}
        variant="primary"
        fill="outline"
        size="sm"
        onClick={onDismiss}
        data-testid={selectors.components.ReturnToPrevious.dismissButton}
      />
    </ButtonGroup>
  );
};

DismissableButton.displayName = 'DismissableButton';
