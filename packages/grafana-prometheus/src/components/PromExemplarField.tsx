// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/components/PromExemplarField.tsx
import { useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { IconButton, InlineLabel, Tooltip } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { type PrometheusDatasource } from '../datasource';
import { type PromQuery } from '../types';

import { promExemplarFieldStyles } from './PromExemplarField.stylex';

interface Props {
  onChange: (exemplar: boolean) => void;
  datasource: PrometheusDatasource;
  query: PromQuery;
  'data-testid'?: string;
}

export function PromExemplarField({ datasource, onChange, query, ...rest }: Props) {
  const [error, setError] = useState<string | null>(null);
  const prevError = usePrevious(error);

  useEffect(() => {
    if (!datasource.exemplarsAvailable) {
      setError('Exemplars for this query are not available');
      onChange(false);
    } else if (query.instant && !query.range) {
      setError('Exemplars are not available for instant queries');
      onChange(false);
    } else {
      setError(null);
      // If error is cleared, we want to change exemplar to true
      if (prevError && !error) {
        onChange(true);
      }
    }
  }, [datasource.exemplarsAvailable, query.instant, query.range, onChange, prevError, error]);

  const iconButtonProps = mergeStylexClassName(
    stylex.props(promExemplarFieldStyles.eyeIcon, query.exemplar && promExemplarFieldStyles.activeIcon)
  );

  return (
    <InlineLabel width="auto" data-testid={rest['data-testid']}>
      <Tooltip content={error ?? ''}>
        <div {...stylex.props(promExemplarFieldStyles.iconWrapper)}>
          <Trans i18nKey="grafana-prometheus.components.prom-exemplar-field.exemplars">Exemplars</Trans>
          <IconButton
            name="eye"
            tooltip={
              !!query.exemplar
                ? t(
                    'grafana-prometheus.components.prom-exemplar-field.tooltip-disable-query',
                    'Disable query with exemplars'
                  )
                : t(
                    'grafana-prometheus.components.prom-exemplar-field.tooltip-enable-query',
                    'Enable query with exemplars'
                  )
            }
            disabled={!!error}
            {...iconButtonProps}
            onClick={() => {
              onChange(!query.exemplar);
            }}
          />
        </div>
      </Tooltip>
    </InlineLabel>
  );
}
