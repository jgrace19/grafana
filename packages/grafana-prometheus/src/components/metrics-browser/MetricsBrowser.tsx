// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/components/PrometheusMetricsBrowser.tsx
import * as stylex from '@stylexjs/stylex';

import { Stack } from '@grafana/ui';

import { LabelSelector } from './LabelSelector';
import { MetricSelector } from './MetricSelector';
import { SelectorActions } from './SelectorActions';
import { metricsBrowserStyles } from './styles.stylex';
import { ValueSelector } from './ValueSelector';

export const MetricsBrowser = () => {
  return (
    <div {...stylex.props(metricsBrowserStyles.wrapper)}>
      <Stack gap={3}>
        <MetricSelector />
        <div>
          <LabelSelector />

          <ValueSelector />
        </div>
      </Stack>

      <SelectorActions />
    </div>
  );
};
