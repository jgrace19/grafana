import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { t } from '@grafana/i18n';
import { Box } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
    <div {...mergeStylexProps(stylex.props(styles.mainContainer), { className })}>
      <div {...stylex.props(styles.container)}>
        <EditorColumnHeader
          label={t('alerting.template-content-and-preview.label-template-content', 'Template content')}
        />
        <Box flex={1}>
          <div {...stylex.props(styles.viewerContainer)}>
            <AutoSizer>
              {({ width, height }) => (
                <TemplateEditor
                  value={templateContent}
                  containerXstyle={styles.editorContainer}
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
          className={stylex.props(styles.templatePreview, styles.minEditorSize).className}
        />
      )}
    </div>
  );
}

const styles = stylex.create({
  editorContainer: {
    width: 'fit-content',
    borderStyle: 'none',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x2'],
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
  },
  templatePreview: {
    flex: '1',
    display: 'flex',
  },
  minEditorSize: {
    minHeight: '300px',
    minWidth: '300px',
  },
  viewerContainer: {
    height: '400px',
    overflow: 'auto',
    backgroundColor: colors['--gf-colors-background-primary'],
  },
});
