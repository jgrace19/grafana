import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, ButtonGroup } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import './DismissableButton.css';

export interface DismissableButtonProps {
  label: string;
  onClick: () => void;
  onDismiss: () => void;
}

export const DismissableButton = ({ label, onClick, onDismiss }: DismissableButtonProps) => {
  return (
    <ButtonGroup className={stylex.props(styles.buttonGroup).className}>
      <Button
        icon="angle-left"
        size="sm"
        variant="primary"
        fill="outline"
        onClick={onClick}
        title={label}
        className={`gf-dismissable-button ${stylex.props(styles.mainDismissableButton).className}`}
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
const styles = stylex.create({
  mainDismissableButton: {
    width: '100%',
  },

  buttonGroup: {
    width: 'fit-content',
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
});

DismissableButton.displayName = 'DismissableButton';
