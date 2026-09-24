import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { templatePreviewStyles } from './TemplatePreview.stylex';
import { compact, uniqueId } from 'lodash';
import * as React from 'react';
import type { JSX } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Trans, t } from '@grafana/i18n';
import { Alert, Box, Button, CodeEditor } from '@grafana/ui';

import {
  type TemplatePreviewErrors,
  type TemplatePreviewResponse,
  type TemplatePreviewResult,
} from '../../api/templateApi';
import { AIFeedbackButtonComponent } from '../../enterprise-components/AI/addAIFeedbackButton';
import { stringifyErrorLike } from '../../utils/misc';
import { EditorColumnHeader } from '../EditorColumnHeader';

import { usePreviewTemplate } from './usePreviewTemplate';

export function TemplatePreview({
  payload,
  templateName,
  templateContent,
  payloadFormatError,
  setPayloadFormatError,
  className,
  aiGeneratedTemplate,
  setAiGeneratedTemplate,
}: {
  payload: string;
  templateName: string;
  templateContent: string;
  payloadFormatError: string | null;
  setPayloadFormatError: (value: React.SetStateAction<string | null>) => void;
  className?: string;
  aiGeneratedTemplate?: boolean;
  setAiGeneratedTemplate?: (aiGeneratedTemplate: boolean) => void;
}) {

  const {
    data,
    isLoading,
    onPreview,
    error: previewError,
  } = usePreviewTemplate(templateContent, templateName, payload, setPayloadFormatError);

  const previewToRender = getPreviewResults(previewError, payloadFormatError, data);

  return (
    <div {...mergeStylexClassName(stylex.props(templatePreviewStyles.container), className)}>
      <EditorColumnHeader
        label={t('alerting.template-preview.label-preview', 'Preview')}
        actions={
          <Button
            disabled={isLoading}
            icon="sync"
            aria-label={t('alerting.template-preview.aria-label-refresh-preview', 'Refresh preview')}
            onClick={() => {
              onPreview();
              setAiGeneratedTemplate?.(false);
            }}
            size="sm"
            variant="secondary"
          >
            <Trans i18nKey="alerting.template-preview.refresh">Refresh</Trans>
          </Button>
        }
      />
      <div className={templatePreviewStyles.viewer.feedbackContainer}>
        <AIFeedbackButtonComponent origin="template" shouldShowFeedbackButton={Boolean(aiGeneratedTemplate)} />
      </div>
      <Box flex={1}>
        <AutoSizer disableWidth>
          {({ height }) => <div className={templatePreviewStyles.viewerContainer({ height })}>{previewToRender}</div>}
        </AutoSizer>
      </Box>
    </div>
  );
}

function PreviewResultViewer({ previews }: { previews: TemplatePreviewResult[] }) {
  // If there is only one template, we don't need to show the name
  const singleTemplate = previews.length === 1;

  const isValidJson = (text: string) => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ul className={templatePreviewStyles.viewer.container} data-testid="template-preview">
      {previews.map((preview) => {
        const language = isValidJson(preview.text) ? 'json' : 'plaintext';
        return (
          <li className={templatePreviewStyles.viewer.box} key={preview.name}>
            {singleTemplate ? null : (
              <header className={templatePreviewStyles.viewer.header}>
                {preview.name}
                <div className={templatePreviewStyles.viewer.language}>{language}</div>
              </header>
            )}
            <CodeEditor
              containerStyles={templatePreviewStyles.editorContainer}
              language={language}
              showLineNumbers={false}
              showMiniMap={false}
              value={preview.text}
              readOnly={true}
              monacoOptions={{
                scrollBeyondLastLine: false,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}

function PreviewErrorViewer({ errors }: { errors: TemplatePreviewErrors[] }) {
  return errors.map((error) => (
    <Alert key={uniqueId('errors-list')} title={compact([error.name, error.kind]).join(' – ')}>
      {error.message}
    </Alert>
  ));
}


export function getPreviewResults(
  previewError: unknown | undefined,
  payloadFormatError: string | null,
  data: TemplatePreviewResponse | undefined
): JSX.Element {
  // ERRORS IN JSON OR IN REQUEST (endpoint not available, for example)
  const previewErrorRequest = previewError ? stringifyErrorLike(previewError) : undefined;
  const errorToRender = payloadFormatError || previewErrorRequest;

  //PREVIEW : RESULTS AND ERRORS
  const previewResponseResults = data?.results ?? [];
  const previewResponseErrors = data?.errors;
  const hasContent = previewResponseResults.length > 0 || previewResponseErrors || errorToRender;

  return (
    <>
      {errorToRender && (
        <Alert severity="error" title={t('alerting.get-preview-results.title-error', 'Error')}>
          {errorToRender}
        </Alert>
      )}
      {previewResponseErrors && <PreviewErrorViewer errors={previewResponseErrors} />}
      {previewResponseResults.length > 0 && <PreviewResultViewer previews={previewResponseResults} />}
      {!hasContent && (
        <div className={templatePreviewStyles.viewer.emptyState}>
          <Trans i18nKey="alerting.template-preview.empty-state">Add template content to see preview</Trans>
        </div>
      )}
    </>
  );
}
