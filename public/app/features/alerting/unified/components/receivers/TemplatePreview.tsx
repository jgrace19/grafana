import * as stylex from '@stylexjs/stylex';
import { compact, uniqueId } from 'lodash';
import * as React from 'react';
import type { JSX } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Trans, t } from '@grafana/i18n';
import { Alert, Box, Button, CodeEditor } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...mergeStylexProps(stylex.props(styles.container), { className })}>
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
      <div {...stylex.props(styles.viewerFeedbackContainer)}>
        <AIFeedbackButtonComponent origin="template" shouldShowFeedbackButton={Boolean(aiGeneratedTemplate)} />
      </div>
      <Box flex={1}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <div {...stylex.props(styles.viewerContainer, styles.height(height))}>{previewToRender}</div>
          )}
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
    <ul {...stylex.props(styles.viewerContainerList)} data-testid="template-preview">
      {previews.map((preview) => {
        const language = isValidJson(preview.text) ? 'json' : 'plaintext';
        return (
          <li {...stylex.props(styles.viewerBox)} key={preview.name}>
            {singleTemplate ? null : (
              <header {...stylex.props(styles.viewerHeader)}>
                {preview.name}
                <div {...stylex.props(styles.viewerLanguage)}>{language}</div>
              </header>
            )}
            <CodeEditor
              containerXstyle={styles.editorContainer}
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

const styles = stylex.create({
  editorContainer: {
    width: '100%',
    height: '100%',
    borderStyle: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
  },
  viewerContainer: {
    overflow: 'auto',
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  height: (height: number) => ({
    height,
  }),
  viewerContainerList: {
    display: 'flex',
    flexDirection: 'column',
    height: 'inherit',
  },
  viewerBox: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    height: 'inherit',
  },
  viewerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: typography['--gf-typography-body-small-font-size'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  viewerLanguage: {
    marginLeft: 'auto',
    fontStyle: 'italic',
  },
  viewerFeedbackContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    minHeight: 'auto',
  },
  viewerEmptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});

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
        <div {...stylex.props(styles.viewerEmptyState)}>
          <Trans i18nKey="alerting.template-preview.empty-state">Add template content to see preview</Trans>
        </div>
      )}
    </>
  );
}
