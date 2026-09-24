import * as stylex from '@stylexjs/stylex';
import { useCopyToClipboard } from 'react-use';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { CodeEditor, Field, IconButton } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { sqlEditorStyles } from '../sqlComponents.stylex';

import { formatSQL } from '../../utils/formatSQL';

type PreviewProps = {
  rawSql: string;
  datasourceType?: string;
};

export function Preview({ rawSql, datasourceType }: PreviewProps) {
  // TODO: use zero index to give feedback about copy success
  const [_, copyToClipboard] = useCopyToClipboard();

  const copyPreview = (rawSql: string) => {
    copyToClipboard(rawSql);
    reportInteraction('grafana_sql_preview_copied', {
      datasource: datasourceType,
    });
  };

  const labelElement = (
    <div {...stylex.props(sqlEditorStyles.previewLabelWrapper)}>
      <span {...stylex.props(sqlEditorStyles.previewLabel)}>
        <Trans i18nKey="grafana-sql.components.preview.label-element.preview">Preview</Trans>
      </span>
      <IconButton
        tooltip={t('grafana-sql.components.preview.label-element.tooltip-copy-to-clipboard', 'Copy to clipboard')}
        onClick={() => copyPreview(rawSql)}
        name="copy"
      />
    </div>
  );

  return (
    <Field label={labelElement} className={mergeStylexClassName(stylex.props(sqlEditorStyles.previewGrow)).className}>
      <CodeEditor
        language="sql"
        height={80}
        value={formatSQL(rawSql)}
        monacoOptions={{ scrollbar: { vertical: 'hidden' }, scrollBeyondLastLine: false }}
        readOnly={true}
        showMiniMap={false}
      />
    </Field>
  );
}

