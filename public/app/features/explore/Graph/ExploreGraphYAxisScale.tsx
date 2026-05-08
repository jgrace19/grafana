import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { RadioButtonGroup } from '@grafana/ui';
import { type ExploreGraphYAxisScale as ExploreGraphYAxisScaleType } from 'app/types/explore';

type Props = {
  yAxisScale: ExploreGraphYAxisScaleType;
  onChangeYAxisScale: (scale: ExploreGraphYAxisScaleType) => void;
};

export function ExploreGraphYAxisScale({ yAxisScale, onChangeYAxisScale }: Props) {
  const yAxisScaleOptions: Array<SelectableValue<ExploreGraphYAxisScaleType>> = [
    {
      value: 'linear',
      label: t('explore.graph-y-axis-scale.label-linear', 'Linear'),
    },
    {
      value: 'log',
      label: t('explore.graph-y-axis-scale.label-log-base-10', 'Log 10'),
    },
    {
      value: 'symlog',
      label: t('explore.graph-y-axis-scale.label-symlog-base-10', 'Symlog 10'),
    },
  ];

  return (
    <RadioButtonGroup
      aria-label={t('explore.graph-y-axis-scale.aria-label', 'Y-axis scale')}
      size="sm"
      options={yAxisScaleOptions}
      value={yAxisScale}
      onChange={onChangeYAxisScale}
    />
  );
}
