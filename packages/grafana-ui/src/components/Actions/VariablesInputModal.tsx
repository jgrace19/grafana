import { variablesInputModalStyleProps } from './VariablesInputModal.stylex';
import { type ActionModel, type ActionVariableInput } from '@grafana/data';
import { t } from '@grafana/i18n';

import { Button } from '../Button/Button';
import { Field } from '../Forms/Field';
import { FieldSet } from '../Forms/FieldSet';
import { Input } from '../Input/Input';
import { Modal } from '../Modal/Modal';

interface Props {
  action: ActionModel;
  onDismiss: () => void;
  onShowConfirm: () => void;
  variables: ActionVariableInput;
  setVariables: (vars: ActionVariableInput) => void;
}

/**
 * @internal
 */
export function VariablesInputModal({ action, onDismiss, onShowConfirm, variables, setVariables }: Props) {

  const onModalContinue = () => {
    onDismiss();
    onShowConfirm();
  };

  return (
    <Modal
      isOpen={true}
      title={t('grafana-ui.action-editor.button.action-variables-title', 'Action variables')}
      onDismiss={onDismiss}
      {...variablesInputModalStyleProps('variablesModal')}
    >
      <FieldSet>
        {action.variables!.map((variable) => (
          <Field key={variable.name} label={variable.name}>
            <Input
              type="text"
              value={variables[variable.key] ?? ''}
              onChange={(e) => {
                setVariables({ ...variables, [variable.key]: e.currentTarget.value });
              }}
              placeholder={t('grafana-ui.action-editor.button.variable-value-placeholder', 'Value')}
              width={20}
            />
          </Field>
        ))}
      </FieldSet>
      <Modal.ButtonRow>
        <Button variant="secondary" onClick={onDismiss}>
          {t('grafana-ui.action-editor.close', 'Close')}
        </Button>
        <Button variant="primary" onClick={onModalContinue}>
          {t('grafana-ui.action-editor.continue', 'Continue')}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
}

;
