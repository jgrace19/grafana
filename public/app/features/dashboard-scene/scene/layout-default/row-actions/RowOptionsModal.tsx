import { t } from '@grafana/i18n';
import { type SceneObject } from '@grafana/scenes';
import { Modal } from '@grafana/ui';

import { type OnRowOptionsUpdate, RowOptionsForm } from './RowOptionsForm';

import './RowOptionsModal.css';

export interface RowOptionsModalProps {
  title: string;
  repeat?: string;
  parent: SceneObject;
  isUsingDashboardDS: boolean;
  onDismiss: () => void;
  onUpdate: OnRowOptionsUpdate;
}

export const RowOptionsModal = ({
  repeat,
  title,
  parent,
  onDismiss,
  onUpdate,
  isUsingDashboardDS,
}: RowOptionsModalProps) => {
  return (
    <Modal
      isOpen={true}
      title={t('dashboard.default-layout.row-options.modal.title', 'Row options')}
      onDismiss={onDismiss}
      className="gf-row-options-modal"
    >
      <RowOptionsForm
        sceneContext={parent}
        repeat={repeat}
        title={title}
        onCancel={onDismiss}
        onUpdate={onUpdate}
        isUsingDashboardDS={isUsingDashboardDS}
      />
    </Modal>
  );
};
