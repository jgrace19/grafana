
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { confirmDeleteModalStyles } from './ConfirmDeleteModal.stylex';
import { t } from '@grafana/i18n';
import { ConfirmModal } from '@grafana/ui';

interface Props {
  varName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmDeleteModal({ varName, isOpen = false, onConfirm, onDismiss }: Props) {
  return (
    <ConfirmModal
      title={t('variables.confirm-delete-modal.title-delete-variable', 'Delete variable')}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      body={t(
        'variables.confirm-delete-modal.body-delete-variable',
        'Are you sure you want to delete variable "{{variableToDelete}}"?',
        { variableToDelete: varName }
      )}
      modalClass={mergeStylexClassName(stylex.props(confirmDeleteModalStyles.modal), undefined).className}
      confirmText={t('variables.confirm-delete-modal.confirmText-delete', 'Delete')}
    />
  );
}

