import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';

import { Trans } from '@grafana/i18n';
import { config, getBackendSrv } from '@grafana/runtime';
import { Button } from '@grafana/ui';
import { mixins } from '@grafana/ui/stylex/mixins';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type MediaType, PickerTabType, type ResourceFolderName } from '../types';

import { FileUploader } from './FileUploader';
import { FolderPickerTab } from './FolderPickerTab';
import { URLPickerTab } from './URLPickerTab';

interface Props {
  value?: string; //img/icons/unicons/0-plus.svg
  onChange: (value?: string) => void;
  mediaType: MediaType;
  folderName: ResourceFolderName;
  maxFiles?: number;
  hidePopper?: () => void;
}

interface ErrorResponse {
  message: string;
}
export const ResourcePickerPopover = (props: Props) => {
  const { value, onChange, mediaType, folderName, maxFiles, hidePopper } = props;
  const onClose = () => {
    onChange(value);
    hidePopper?.();
  };

  const ref = useRef<HTMLElement>(null);
  const { dialogProps } = useDialog({}, ref);
  const { overlayProps } = useOverlay({ onClose, isDismissable: true, isOpen: true }, ref);

  const isURL = value && value.includes('://');
  const [newValue, setNewValue] = useState<string>(value ?? '');
  const [activePicker, setActivePicker] = useState<PickerTabType>(isURL ? PickerTabType.URL : PickerTabType.Folder);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [upload, setUpload] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse>({ message: '' });

  const getTabProps = (tabName: PickerTabType) =>
    stylex.props(
      mixins.mouseFocusNone,
      styles.resourcePickerPopoverTab,
      activePicker === tabName && styles.resourcePickerPopoverActiveTab
    );

  const renderFolderPicker = () => (
    <FolderPickerTab
      value={value}
      mediaType={mediaType}
      folderName={folderName}
      newValue={newValue}
      setNewValue={setNewValue}
      maxFiles={maxFiles}
    />
  );

  const renderURLPicker = () => <URLPickerTab newValue={newValue} setNewValue={setNewValue} mediaType={mediaType} />;
  const renderUploader = () => (
    <FileUploader
      mediaType={mediaType}
      setFormData={setFormData}
      setUpload={setUpload}
      newValue={newValue}
      error={error}
    />
  );
  const renderPicker = () => {
    switch (activePicker) {
      case PickerTabType.Folder:
        return renderFolderPicker();
      case PickerTabType.URL:
        return renderURLPicker();
      case PickerTabType.Upload:
        return renderUploader();
      default:
        return renderFolderPicker();
    }
  };

  return (
    <FocusScope contain autoFocus restoreFocus>
      <section ref={ref} {...overlayProps} {...dialogProps}>
        <div {...stylex.props(styles.resourcePickerPopover)}>
          <div {...stylex.props(styles.resourcePickerPopoverTabs)}>
            <button {...getTabProps(PickerTabType.Folder)} onClick={() => setActivePicker(PickerTabType.Folder)}>
              <Trans i18nKey="dimensions.resource-picker-popover.folder">Folder</Trans>
            </button>
            <button {...getTabProps(PickerTabType.URL)} onClick={() => setActivePicker(PickerTabType.URL)}>
              <Trans i18nKey="dimensions.resource-picker-popover.url">URL</Trans>
            </button>
          </div>
          <div {...stylex.props(styles.resourcePickerPopoverContent)}>
            {renderPicker()}
            <div {...stylex.props(styles.buttonRow)}>
              <Button variant={'secondary'} onClick={() => onClose()} fill="outline">
                <Trans i18nKey="dimensions.resource-picker-popover.cancel">Cancel</Trans>
              </Button>
              <Button
                variant={newValue && newValue !== value ? 'primary' : 'secondary'}
                onClick={() => {
                  if (upload) {
                    fetch('/api/storage/upload', {
                      method: 'POST',
                      body: formData,
                    })
                      .then((res) => {
                        if (res.status >= 400) {
                          res.json().then((data) => setError(data));
                          return;
                        } else {
                          return res.json();
                        }
                      })
                      .then((data) => {
                        getBackendSrv()
                          .get(`api/storage/read/${data.path}`)
                          .then(() => setNewValue(`${config.appUrl}api/storage/read/${data.path}`))
                          .then(() => onChange(`${config.appUrl}api/storage/read/${data.path}`))
                          .then(() => hidePopper?.());
                      })
                      .catch((err) => console.error(err));
                  } else {
                    onChange(newValue);
                    hidePopper?.();
                  }
                }}
              >
                <Trans i18nKey="dimensions.resource-picker-popover.select">Select</Trans>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </FocusScope>
  );
};

const styles = stylex.create({
  resourcePickerPopover: {
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
  },
  resourcePickerPopoverTab: {
    width: '50%',
    textAlign: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    backgroundColor: colors['--gf-colors-background-secondary'],
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    cursor: 'pointer',
    borderStyle: 'none',
    position: { default: null, ':focus-visible': 'relative' },
  },
  resourcePickerPopoverActiveTab: {
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  resourcePickerPopoverContent: {
    width: '315px',
    fontSize: typography['--gf-typography-body-small-font-size'],
    minHeight: '184px',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    display: 'flex',
    flexDirection: 'column',
  },
  resourcePickerPopoverTabs: {
    display: 'flex',
    width: '100%',
    borderTopLeftRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: 'unset',
    borderBottomLeftRadius: 'unset',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing['--gf-spacing-x2'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});
