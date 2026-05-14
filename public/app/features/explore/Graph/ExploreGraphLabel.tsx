import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { RadioButtonGroup, Stack } from '@grafana/ui';
import {
  EXPLORE_GRAPH_STYLES,
  type ExploreGraphScale,
  type ExploreGraphStyle,
  isStackedGraphStyle,
} from 'app/types/explore';

const ALL_GRAPH_STYLE_OPTIONS: Array<SelectableValue<ExploreGraphStyle>> = EXPLORE_GRAPH_STYLES.map((style) => ({
  value: style,
  // capital-case it and switch `_` to ` `
  label: style[0].toUpperCase() + style.slice(1).replace(/_/, ' '),
}));

type Props = {
  graphStyle: ExploreGraphStyle;
  onChangeGraphStyle: (style: ExploreGraphStyle) => void;
  graphScale: ExploreGraphScale;
  onChangeGraphScale: (scale: ExploreGraphScale) => void;
};

export function ExploreGraphLabel(props: Props) {
  const { graphStyle, onChangeGraphStyle, graphScale, onChangeGraphScale } = props;

  // Stacked styles compose additively while log composes multiplicatively;
  // the combination is meaningless, so we disable Log when stacked.
  const stacked = isStackedGraphStyle(graphStyle);
  const scaleOptions: Array<SelectableValue<ExploreGraphScale>> = [
    { value: 'linear', label: t('explore.graph.scale-linear', 'Linear') },
    {
      value: 'log',
      label: t('explore.graph.scale-log', 'Logarithmic'),
      description: stacked
        ? t('explore.graph.scale-log-disabled-stacked', 'Logarithmic scale is unavailable for stacked graph styles')
        : undefined,
    },
  ];

  return (
    <Stack direction="row" gap={1} wrap="wrap" alignItems="center">
      <RadioButtonGroup
        size="sm"
        options={ALL_GRAPH_STYLE_OPTIONS}
        value={graphStyle}
        onChange={onChangeGraphStyle}
        aria-label={t('explore.graph.graph-style-aria-label', 'Graph style')}
      />
      <RadioButtonGroup
        size="sm"
        options={scaleOptions}
        value={graphScale}
        onChange={onChangeGraphScale}
        disabledOptions={stacked ? ['log'] : undefined}
        aria-label={t('explore.graph.graph-scale-aria-label', 'Y-axis scale')}
      />
    </Stack>
  );
}
