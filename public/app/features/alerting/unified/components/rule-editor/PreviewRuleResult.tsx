import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { type FieldConfigSource, FieldMatcherID, LoadingState } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { PanelRenderer } from '@grafana/runtime';
import { TableCellDisplayMode } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      <div {...stylex.props(styles.container)}>
        <span>
          <Trans i18nKey="alerting.preview-rule-result.loading-preview">Loading preview...</Trans>
        </span>
      </div>
    );
  }

  if (data.state === LoadingState.Error) {
    return (
      <div {...stylex.props(styles.container)}>
        {data.error
          ? messageFromError(data.error)
          : t('alerting.preview-rule-result.preview-failed', 'Failed to preview alert rule')}
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      <Trans i18nKey="alerting.preview-rule-result.preview-based-on-query-result">
        Preview based on the result of running the query, for this moment.
      </Trans>
      {ruleType === RuleFormType.grafana && (
        <Trans i18nKey="alerting.preview-rule-result.no-data-error-handling-not-applied">
          Configuration for `no data` and `error handling` is not applied.
        </Trans>
      )}
      <div {...stylex.props(styles.table)}>
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

const styles = stylex.create({
  container: {
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
  table: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    height: '135px',
    marginTop: spacing['--gf-spacing-x2'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
});
