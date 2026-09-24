import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';

import { t } from '@grafana/i18n';
import { Alert, Button, IconButton, Modal, Sidebar, Tooltip } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { DashboardSchemaEditor, type SchemaEditorFormat } from '../v2schema/DashboardSchemaEditor';

import './DashboardCodePane.css';

export interface DashboardCodePaneProps {
  initialValue: string;
  onApply: (jsonText: string) => { success: boolean; error?: string };
}

export function DashboardCodePane({ initialValue, onApply }: DashboardCodePaneProps) {
  const [hasValidationErrors, setHasValidationErrors] = useState(true);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState(initialValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorFormat, setEditorFormat] = useState<SchemaEditorFormat>('json');

  const handleChange = useCallback((value: string) => {
    setJsonText(value);
    setApplyError(null);
  }, []);

  const handleApply = useCallback(() => {
    setApplyError(null);
    const result = onApply(jsonText);
    if (!result.success) {
      setApplyError(result.error ?? 'Failed to apply changes');
    }
  }, [onApply, jsonText]);

  const applyTooltip =
    editorFormat === 'yaml'
      ? t(
          'dashboard.schema-editor.apply-button-disabled-tooltip-yaml',
          'Document has validation errors. Switch to JSON to see inline error details.'
        )
      : t('dashboard.schema-editor.apply-button-disabled-tooltip', 'Fix validation errors before applying changes');

  const applyButton = (
    <Tooltip content={applyTooltip} placement="top" show={hasValidationErrors ? undefined : false}>
      <Button onClick={handleApply} disabled={hasValidationErrors} size="sm">
        {t('dashboard.schema-editor.apply-button', 'Apply changes')}
      </Button>
    </Tooltip>
  );

  const errorAlert = applyError ? (
    <Alert
      title={t('dashboard.schema-editor.apply-error-title', 'Failed to apply changes')}
      severity="error"
      topSpacing={0}
      bottomSpacing={0}
    >
      {applyError}
    </Alert>
  ) : null;

  const editorProps = {
    value: jsonText,
    onChange: handleChange,
    onValidationChange: setHasValidationErrors,
    onFormatChange: setEditorFormat,
    showFormatToggle: true,
  };

  return (
    <div {...stylex.props(styles.wrapper)}>
      <Sidebar.PaneHeader title={t('dashboard.code-pane.header', 'Edit as code')} />
      <div {...stylex.props(styles.content)}>
        {errorAlert}
        <div {...stylex.props(styles.editorContainer)}>
          <DashboardSchemaEditor {...editorProps} containerStyles={stylex.props(styles.codeEditor).className} />
        </div>
        <div {...stylex.props(styles.toolbar)}>
          {applyButton}
          <IconButton
            name="expand-arrows"
            size="sm"
            tooltip={t('dashboard.code-pane.expand', 'Expand editor')}
            onClick={() => setIsExpanded(true)}
          />
        </div>
      </div>

      {isExpanded && (
        <Modal
          title={t('dashboard.code-pane.modal-title', 'Edit dashboard as code')}
          isOpen
          onDismiss={() => setIsExpanded(false)}
          className="gf-dashboard-code-pane-modal"
          contentClassName="gf-dashboard-code-pane-modal-content"
          closeOnBackdropClick={false}
          closeOnEscape={false}
        >
          <div {...stylex.props(styles.modalEditorWrapper)}>
            {errorAlert}
            <DashboardSchemaEditor {...editorProps} />
            <div {...stylex.props(styles.toolbar)}>
              {applyButton}
              <IconButton
                name="compress-arrows"
                size="sm"
                tooltip={t('dashboard.code-pane.collapse', 'Collapse editor')}
                onClick={() => setIsExpanded(false)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minHeight: 0,
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    gap: spacing['--gf-spacing-x1'],
  },
  editorContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minHeight: 0,
  },
  codeEditor: {
    height: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  modalEditorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minHeight: 0,
    gap: spacing['--gf-spacing-x1'],
  },
});
