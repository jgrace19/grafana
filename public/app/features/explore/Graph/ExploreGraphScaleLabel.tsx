import { type SelectableValue } from '@grafana/data';
import { RadioButtonGroup } from '@grafana/ui';
import { EXPLORE_GRAPH_SCALES, type ExploreGraphScale } from 'app/types/explore';

const ALL_GRAPH_SCALE_OPTIONS: Array<SelectableValue<ExploreGraphScale>> = EXPLORE_GRAPH_SCALES.map((scale) => ({
  value: scale,
  label: scale === 'linear' ? 'Linear' : 'Log10',
}));

type Props = {
  graphScale: ExploreGraphScale;
  onChangeGraphScale: (scale: ExploreGraphScale) => void;
};

export function ExploreGraphScaleLabel(props: Props) {
  const { graphScale, onChangeGraphScale } = props;
  return (
    <RadioButtonGroup size="sm" options={ALL_GRAPH_SCALE_OPTIONS} value={graphScale} onChange={onChangeGraphScale} />
  );
}
