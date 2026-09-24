import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Trans, t } from '@grafana/i18n';
import { Button, CodeEditor, Dropdown, Menu, Stack, Toggletip } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { type TestTemplateAlert } from 'app/plugins/datasource/alertmanager/types';

import { EditorColumnHeader } from '../EditorColumnHeader';

import { AlertInstanceModalSelector } from './AlertInstanceModalSelector';
import { AlertTemplatePreviewData } from './TemplateData';
import { TemplateDataTable } from './TemplateDataDocs';
import { GenerateAlertDataModal } from './form/GenerateAlertDataModal';

export const RESET_TO_DEFAULT = 'Reset to defaults';

export function PayloadEditor({
  payload,
  setPayload,
  defaultPayload,
  setPayloadFormatError,
  payloadFormatError,
  className,
}: {
  payload: string;
  defaultPayload: string;
  setPayload: React.Dispatch<React.SetStateAction<string>>;
  setPayloadFormatError: (value: React.SetStateAction<string | null>) => void;
  payloadFormatError: string | null;
  className?: string;
}) {
  const onReset = () => {
    setPayload(defaultPayload);
  };

  const [isEditingAlertData, setIsEditingAlertData] = useState(false);

  const onCloseEditAlertModal = () => {
    setIsEditingAlertData(false);
  };

  const errorInPayloadJson = payloadFormatError !== null;

  const validatePayload = () => {
    try {
      const payloadObj = JSON.parse(payload);
      JSON.stringify([...payloadObj]); // check if it's iterable, in order to be able to add more data
      setPayloadFormatError(null);
    } catch (e) {
      setPayloadFormatError(e instanceof Error ? e.message : 'Invalid JSON.');
      throw e;
    }
  };

  const onOpenEditAlertModal = () => {
    try {
      validatePayload();
      setIsEditingAlertData(true);
    } catch (e) {}
  };

  const onOpenAlertSelectorModal = () => {
    try {
      validatePayload();
      setIsAlertSelectorOpen(true);
    } catch (e) {}
  };

  const onAddAlertList = (alerts: TestTemplateAlert[]) => {
    onCloseEditAlertModal();
    setIsAlertSelectorOpen(false);
    setPayload((payload) => {
      const payloadObj = JSON.parse(payload);
      return JSON.stringify([...payloadObj, ...alerts], undefined, 2);
    });
  };

  const [isAlertSelectorOpen, setIsAlertSelectorOpen] = useState(false);

  return (
    <>
      <div {...mergeStylexProps(stylex.props(styles.wrapper), { className })}>
        <EditorColumnHeader
          label={t('alerting.payload-editor.label-payload', 'Payload')}
          actions={
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      label={t(
                        'alerting.payload-editor.label-use-existing-alert-instances',
                        'Use existing alert instances'
                      )}
                      disabled={errorInPayloadJson}
                      onClick={onOpenAlertSelectorModal}
                    />
                    <Menu.Item
                      label={t('alerting.payload-editor.label-add-custom-alert-instance', 'Add custom alert instance')}
                      disabled={errorInPayloadJson}
                      onClick={onOpenEditAlertModal}
                    />
                    <Menu.Divider />
                    <Menu.Item label={RESET_TO_DEFAULT} onClick={onReset} destructive />
                  </Menu>
                }
              >
                <Button variant="secondary" size="sm" icon="angle-down">
                  <Trans i18nKey="alerting.payload-editor.edit-payload">Edit payload</Trans>
                </Button>
              </Dropdown>
              <Toggletip content={<AlertTemplateDataTable />} placement="top" fitContent>
                <Button variant="secondary" fill="outline" size="sm" icon="question-circle">
                  <Trans i18nKey="alerting.payload-editor.reference">Reference</Trans>
                </Button>
              </Toggletip>
            </Stack>
          }
        />

        <div {...stylex.props(styles.editorWrapper)}>
          <AutoSizer>
            {({ width, height }) => (
              <CodeEditor
                containerXstyle={styles.editorContainer}
                width={width}
                height={height}
                language={'json'}
                showLineNumbers={true}
                showMiniMap={false}
                value={payload}
                readOnly={false}
                onBlur={setPayload}
                monacoOptions={{
                  scrollBeyondLastLine: false,
                }}
              />
            )}
          </AutoSizer>
        </div>
      </div>

      <GenerateAlertDataModal isOpen={isEditingAlertData} onDismiss={onCloseEditAlertModal} onAccept={onAddAlertList} />

      <AlertInstanceModalSelector
        onSelect={onAddAlertList}
        isOpen={isAlertSelectorOpen}
        onClose={() => setIsAlertSelectorOpen(false)}
      />
    </>
  );
}
const AlertTemplateDataTable = () => {
  return <TemplateDataTable dataItems={AlertTemplatePreviewData} />;
};
const styles = stylex.create({
  editorContainer: {
    width: 'fit-content',
    borderStyle: 'none',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  editorWrapper: {
    flex: '1',
  },
});
