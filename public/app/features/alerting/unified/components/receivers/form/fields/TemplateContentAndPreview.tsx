import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { templateContentAndPreviewStyles } from './TemplateContentAndPreview.stylex';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { t } from '@grafana/i18n';
import { Box } from '@grafana/ui';
import { useAlertmanager } from 'app/features/alerting/unified/state/AlertmanagerContext';
import { GRAFANA_RULES_SOURCE_NAME } from 'app/features/alerting/unified/utils/datasource';

import { EditorColumnHeader } from '../../../EditorColumnHeader';
import { TemplateEditor } from '../../TemplateEditor';
import { TemplatePreview } from '../../TemplatePreview';

import { getUseTemplateText } from './utils';

export function TemplateContentAndPreview({
  payload,
  templateContent,
  templateName,
  payloadFormatError,
  setPayloadFormatError,
  className,
}: {
  payload: string;
  templateName: string;
  payloadFormatError: string | null;
  setPayloadFormatError: (value: React.SetStateAction<string | null>) => void;
  className?: string;
  templateContent: string;
}) {

  const { selectedAlertmanager } = useAlertmanager();

  const isGrafanaAlertManager = selectedAlertmanager === GRAFANA_RULES_SOURCE_NAME;

  return (
    <div {...mergeStylexClassName(stylex.props(templateContentAndPreviewStyles.mainContainer), className)}>
      <div {...stylex.props(templateContentAndPreviewStyles.container)}>
        <EditorColumnHeader
          label={t('alerting.template-content-and-preview.label-template-content', 'Template content')}
        />
        <Box flex={1}>
          <div className={templateContentAndPreviewStyles.viewerContainer({ height: 400 })}>
            <AutoSizer>
              {({ width, height }) => (
                <TemplateEditor
                  value={templateContent}
                  containerStyles={templateContentAndPreviewStyles.editorContainer}
                  width={width}
                  height={height}
                  readOnly
                />
              )}
            </AutoSizer>
          </div>
        </Box>
      </div>

      {isGrafanaAlertManager && (
        <TemplatePreview
          payload={payload}
          // This should be an empty template name so that the test API treats it as a new unnamed template.
          templateName={''}
          templateContent={getUseTemplateText(templateName)}
          setPayloadFormatError={setPayloadFormatError}
          payloadFormatError={payloadFormatError}
          className={cx(templateContentAndPreviewStyles.templatePreview, templateContentAndPreviewStyles.minEditorSize)}
        />
      )}
    </div>
  );
}

