import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Icon, ModalsController } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';

import { type OnRowOptionsUpdate } from './RowOptionsForm';
import { RowOptionsModal } from './RowOptionsModal';

export interface RowOptionsButtonProps {
  title: string;
  repeat?: string;
  onUpdate: OnRowOptionsUpdate;
  warning?: React.ReactNode;
  /** StyleX overrides for the button */
  xstyle?: StyleXStyles;
}

export const RowOptionsButton = ({ repeat, title, onUpdate, warning, xstyle }: RowOptionsButtonProps) => {
  const onUpdateChange = (hideModal: () => void) => (title: string, repeat?: string | null) => {
    onUpdate(title, repeat);
    hideModal();
  };

  return (
    <ModalsController>
      {({ showModal, hideModal }) => {
        return (
          <button
            type="button"
            {...mergeStylexProps(stylex.props(xstyle), { className: 'pointer' })}
            aria-label={t('dashboard.row-options-button.aria-label-row-options', 'Row options')}
            onClick={() => {
              showModal(RowOptionsModal, {
                title,
                repeat,
                onDismiss: hideModal,
                onUpdate: onUpdateChange(hideModal),
                warning,
              });
            }}
          >
            <Icon name="cog" />
          </button>
        );
      }}
    </ModalsController>
  );
};

RowOptionsButton.displayName = 'RowOptionsButton';
