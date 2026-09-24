// eslint-disable-next-line no-restricted-imports -- stylex: pending Modal migration (see modalStyles)
import { css } from '@emotion/css';
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
      className={modalStyles}
    >
      <RowOptionsForm repeat={repeat} title={title} onCancel={onDismiss} onUpdate={onUpdate} warning={warning} />
    </Modal>
  );
};

// stylex: pending Modal migration. Modal's own Emotion width would beat a StyleX override.
const modalStyles = css({
  width: '500px',
});
