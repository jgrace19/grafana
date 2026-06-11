import { type SelectableValue } from '@grafana/data';
import { RadioButtonGroup } from '@grafana/ui';
import { EXPLORE_GRAPH_SCALES, EXPLORE_GRAPH_STYLES, type ExploreGraphScale, type ExploreGraphStyle } from 'app/types/explore';

const ALL_GRAPH_STYLE_OPTIONS: Array<SelectableValue<ExploreGraphStyle>> = EXPLORE_GRAPH_STYLES.map((style) => ({
  value: style,
  // capital-case it and switch `_` to ` `
  label: style[0].toUpperCase() + style.slice(1).replace(/_/, ' '),
}));

const ALL_GRAPH_SCALE_OPTIONS: Array<SelectableValue<ExploreGraphScale>> = EXPLORE_GRAPH_SCALES.map((scale) => ({
  value: scale,
  label: scale[0].toUpperCase() + scale.slice(1),
}));

type Props = {
  graphStyle: ExploreGraphStyle;
  graphScale: ExploreGraphScale;
  onChangeGraphStyle: (style: ExploreGraphStyle) => void;
  onChangeGraphScale: (scale: ExploreGraphScale) => void;
};

export function ExploreGraphLabel(props: Props) {
  const { graphStyle, graphScale, onChangeGraphStyle, onChangeGraphScale } = props;
  return (
    <>
      <RadioButtonGroup size="sm" options={ALL_GRAPH_STYLE_OPTIONS} value={graphStyle} onChange={onChangeGraphStyle} />
      <RadioButtonGroup size="sm" options={ALL_GRAPH_SCALE_OPTIONS} value={graphScale} onChange={onChangeGraphScale} />
    </>
  );
}
