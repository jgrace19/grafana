import * as stylex from '@stylexjs/stylex';
import saveAs from 'file-saver';
import { useCallback, useMemo } from 'react';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Trans, t } from '@grafana/i18n';
import { Alert, Button, ClipboardButton, CodeEditor, TextLink } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import {
  DOCS_URL_FILE_PROVISIONING,
  DOCS_URL_HTTP_API_PROVISIONING,
  DOCS_URL_TERRAFORM_PROVISIONING,
} from '../../utils/docs';

import { type ExportFormats, type ExportProvider, type ProvisioningType, allGrafanaExportProviders } from './providers';

interface FileExportPreviewProps {
  format: ExportFormats;
  textDefinition: string;

  /*** Filename without extension ***/
  downloadFileName: string;
  onClose: () => void;
}

export function FileExportPreview({ format, textDefinition, downloadFileName, onClose }: FileExportPreviewProps) {
  const provider = allGrafanaExportProviders[format];

  const onDownload = useCallback(() => {
    const blob = new Blob([textDefinition], {
      type: `application/${format};charset=utf-8`,
    });
    saveAs(blob, `${downloadFileName}.${format}`);
  }, [textDefinition, downloadFileName, format]);

  const formattedTextDefinition = useMemo(() => {
    return provider.formatter ? provider.formatter(textDefinition) : textDefinition;
  }, [provider, textDefinition]);

  return (
    // TODO Handle empty content
    <div {...stylex.props(styles.container)}>
      <FileExportInlineDocumentation exportProvider={provider} />
      <div {...stylex.props(styles.content)}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CodeEditor
              width="100%"
              height={height}
              language={format}
              value={formattedTextDefinition}
              monacoOptions={{
                minimap: {
                  enabled: false,
                },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                readOnly: true,
              }}
            />
          )}
        </AutoSizer>
      </div>
      <div {...stylex.props(styles.actions)}>
        <Button variant="secondary" onClick={onClose}>
          <Trans i18nKey="alerting.common.cancel">Cancel</Trans>
        </Button>
        <ClipboardButton icon="copy" getText={() => textDefinition}>
          <Trans i18nKey="alerting.file-export-preview.copy-code">Copy code</Trans>
        </ClipboardButton>
        <Button icon="download-alt" onClick={onDownload}>
          <Trans i18nKey="alerting.file-export-preview.download">Download</Trans>
        </Button>
      </div>
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: spacing['--gf-spacing-x2'],
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
  },
  actions: {
    flex: '0',
    justifyContent: 'flex-end',
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
  },
});

function FileExportInlineDocumentation({ exportProvider }: { exportProvider: ExportProvider<unknown> }) {
  const { name, type } = exportProvider;

  const exportInlineDoc: Record<ProvisioningType, { title: string; component: React.ReactNode }> = {
    file: {
      title: t(
        'alerting.file-export-inline-documentation.export-inline-doc.title.fileprovisioning-format',
        'File-provisioning format'
      ),
      component: (
        <Trans i18nKey="alerting.file-export-inline-documentation.file-provisioning">
          {{ name }} format is only valid for File Provisioning.{' '}
          <TextLink href={DOCS_URL_FILE_PROVISIONING} external>
            Read more in the docs.
          </TextLink>
        </Trans>
      ),
    },
    api: {
      title: t(
        'alerting.file-export-inline-documentation.export-inline-doc.title.apiprovisioning-format',
        'API-provisioning format'
      ),
      component: (
        <Trans i18nKey="alerting.file-export-inline-documentation.api-provisioning">
          {{ name }} format is only valid for API Provisioning.{' '}
          <TextLink href={DOCS_URL_HTTP_API_PROVISIONING} external>
            Read more in the docs.
          </TextLink>
        </Trans>
      ),
    },
    terraform: {
      title: t(
        'alerting.file-export-inline-documentation.export-inline-doc.title.terraformprovisioning-format',
        'Terraform-provisioning format'
      ),
      component: (
        <Trans i18nKey="alerting.file-export-inline-documentation.terraform-provisioning">
          {{ name }} format is only valid for Terraform Provisioning.{' '}
          <TextLink href={DOCS_URL_TERRAFORM_PROVISIONING} external>
            Read more in the docs.
          </TextLink>
        </Trans>
      ),
    },
  };

  const { title, component } = exportInlineDoc[type];

  return (
    <Alert title={title} severity="info" bottomSpacing={0} topSpacing={0}>
      {component}
    </Alert>
  );
}
