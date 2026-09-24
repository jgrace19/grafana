import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Modal } from '@grafana/ui';

import { type OnRowOptionsUpdate, RowOptionsForm } from './RowOptionsForm';
export interface RowOptionsModalProps {
  title: string;
  repeat?: string;
  warning?: React.ReactNode;
  onDismiss: () => void;
  onUpdate: OnRowOptionsUpdate;
}

export const RowOptionsModal = ({ repeat, title, onDismiss, onUpdate, warning }: RowOptionsModalProps) => {
  return (
    <Modal
      isOpen={true}
      title={t('dashboard.row-options-modal.title-row-options', 'Row options')}
      onDismiss={onDismiss}
      xstyle={styles.modal}
    >
      <RowOptionsForm repeat={repeat} title={title} onCancel={onDismiss} onUpdate={onUpdate} warning={warning} />
    </Modal>
  );
};

const styles = stylex.create({
  modal: {
    width: '500px',
  },
});
