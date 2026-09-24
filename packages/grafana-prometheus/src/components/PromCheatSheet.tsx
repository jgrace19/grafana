// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/components/PromCheatSheet.tsx
import * as stylex from '@stylexjs/stylex';

import { type QueryEditorHelpProps } from '@grafana/data';
import { Trans } from '@grafana/i18n';

import { type PromQuery } from '../types';

import { promCheatSheetStyles } from './PromCheatSheet.stylex';

const CHEAT_SHEET_ITEMS = [
  {
    title: 'Request Rate',
    expression: 'rate(http_request_total[5m])',
    label:
      'Given an HTTP request counter, this query calculates the per-second average request rate over the last 5 minutes.',
  },
  {
    title: '95th Percentile of Request Latencies',
    expression: 'histogram_quantile(0.95, sum(rate(prometheus_http_request_duration_seconds_bucket[5m])) by (le))',
    label: 'Calculates the 95th percentile of HTTP request rate over 5 minute windows.',
  },
  {
    title: 'Alerts Firing',
    expression: 'sort_desc(sum(sum_over_time(ALERTS{alertstate="firing"}[24h])) by (alertname))',
    label: 'Sums up the alerts that have been firing over the last 24 hours.',
  },
  {
    title: 'Step',
    label:
      'Defines the graph resolution using a duration format (15s, 1m, 3h, ...). Small steps create high-resolution graphs but can be slow over larger time ranges. Using a longer step lowers the resolution and smooths the graph by producing fewer datapoints. If no step is given the resolution is calculated automatically.',
  },
];

export const PromCheatSheet = (props: QueryEditorHelpProps<PromQuery>) => {
  return (
    <div>
      <h2>
        <Trans i18nKey="grafana-prometheus.components.prom-cheat-sheet.prom-ql-cheat-sheet">PromQL Cheat Sheet</Trans>
      </h2>
      {CHEAT_SHEET_ITEMS.map((item, index) => (
        <div {...stylex.props(promCheatSheetStyles.cheatSheetItem)} key={index}>
          <div {...stylex.props(promCheatSheetStyles.cheatSheetItemTitle)}>{item.title}</div>
          {item.expression ? (
            <button
              type="button"
              {...stylex.props(promCheatSheetStyles.cheatSheetExample)}
              onClick={(e) => props.onClickExample({ refId: 'A', expr: item.expression })}
            >
              <code>{item.expression}</code>
            </button>
          ) : null}
          {item.label}
        </div>
      ))}
    </div>
  );
};
