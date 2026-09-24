import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { previewRuleResultStyles } from './PreviewRuleResult.stylex';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { type FieldConfigSource, FieldMatcherID, type GrafanaTheme2, LoadingState } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { PanelRenderer } from '@grafana/runtime';
import { TableCellDisplayMode } from '@grafana/ui';

import { type PreviewRuleResponse } from '../../types/preview';
import { RuleFormType } from '../../types/rule-form';
import { messageFromError } from '../../utils/redux';

type Props = {
  preview: PreviewRuleResponse | undefined;
};

export function PreviewRuleResult(props: Props): React.ReactElement | null {
  const { preview } = props;

  const fieldConfig: FieldConfigSource = {
    defaults: {},
    overrides: [
      {
        matcher: { id: FieldMatcherID.byName, options: 'Info' },
        properties: [{ id: 'custom.displayMode', value: TableCellDisplayMode.JSONView }],
      },
    ],
  };

  if (!preview) {
    return null;
  }

  const { data, ruleType } = preview;

  if (data.state === LoadingState.Loading) {
    return (
      <div {...stylex.props(previewRuleResultStyles.container)}>
        <span>
          <Trans i18nKey="alerting.preview-rule-result.loading-preview">Loading preview...</Trans>
        </span>
      </div>
    );
  }

  if (data.state === LoadingState.Error) {
    return (
      <div {...stylex.props(previewRuleResultStyles.container)}>
        {data.error
          ? messageFromError(data.error)
          : t('alerting.preview-rule-result.preview-failed', 'Failed to preview alert rule')}
      </div>
    );
  }

  return (
    <div {...stylex.props(previewRuleResultStyles.container)}>
      <Trans i18nKey="alerting.preview-rule-result.preview-based-on-query-result">
        Preview based on the result of running the query, for this moment.
      </Trans>
      {ruleType === RuleFormType.grafana && (
        <Trans i18nKey="alerting.preview-rule-result.no-data-error-handling-not-applied">
          Configuration for `no data` and `error handling` is not applied.
        </Trans>
      )}
      <div {...stylex.props(previewRuleResultStyles.table)}>
        <AutoSizer>
          {({ width, height }) => (
            <div style={{ width: `${width}px`, height: `${height}px` }}>
              <PanelRenderer
                title=""
                width={width}
                height={height}
                pluginId="table"
                data={data}
                fieldConfig={fieldConfig}
              />
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

