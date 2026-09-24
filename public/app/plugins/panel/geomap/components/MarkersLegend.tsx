import * as stylex from '@stylexjs/stylex';
import type BaseLayer from 'ol/layer/Base';
import { useMemo } from 'react';
import { useObservable } from 'react-use';
import { of } from 'rxjs';

import { getMinMaxAndDelta, type DataFrame, formattedValueToString, getFieldColorModeForField } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { type VizLegendItem } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { ColorScale } from 'app/core/components/ColorScale/ColorScale';
import { SanitizedSVG } from 'app/core/components/SVG/SanitizedSVG';
import { getThresholdItems } from 'app/core/components/TimelineChart/utils';
import { type DimensionSupplier } from 'app/features/dimensions/types';

import { type StyleConfigState } from '../style/types';
import { type MapLayerState } from '../types';

export interface MarkersLegendProps {
  size?: DimensionSupplier<number>;
  layerName?: string;
  styleConfig?: StyleConfigState;
  layer?: BaseLayer;
}

export function MarkersLegend(props: MarkersLegendProps) {
  const { layerName, styleConfig, layer } = props;

  const hoverEvent = useObservable(((layer as any)?.__state as MapLayerState)?.mouseEvents ?? of(undefined));

  const colorField = styleConfig?.dims?.color?.field;
  const hoverValue = useMemo(() => {
    if (!colorField || !hoverEvent) {
      return undefined;
    }

    const props = hoverEvent.getProperties();
    const frame: DataFrame = props.frame;

    if (!frame) {
      return undefined;
    }

    const rowIndex: number = props.rowIndex;
    return colorField.values[rowIndex];
  }, [hoverEvent, colorField]);

  if (!styleConfig) {
    return <></>;
  }

  const { color, opacity } = styleConfig?.base ?? {};
  const symbol = styleConfig?.config.symbol?.fixed;

  if (color && symbol && !colorField) {
    return (
      <div {...stylex.props(styles.infoWrap)}>
        <div {...stylex.props(styles.layerName)}>{layerName}</div>
        <div {...stylex.props(styles.layerBody, styles.fixedColorContainer)}>
          <SanitizedSVG
            src={`${window.__grafana_public_path__}build/${symbol}`}
            title={t('geomap.markers-legend.title-symbol', 'Symbol')}
            {...mergeStylexProps(stylex.props(styles.legendSymbol), { style: { fill: color, opacity: opacity } })}
          />
        </div>
      </div>
    );
  }

  if (!colorField) {
    return <></>;
  }

  const colorMode = getFieldColorModeForField(colorField);

  if (colorMode.isContinuous && colorMode.getColors) {
    const colors = colorMode.getColors(config.theme2);
    const colorRange = getMinMaxAndDelta(colorField);
    // TODO: explore showing mean on the gradient scale
    // const stats = reduceField({
    //   field: color.field!,
    //   reducers: [
    //     ReducerID.min,
    //     ReducerID.max,
    //     ReducerID.mean,
    //     // std dev?
    //   ]
    // })

    const display = colorField.display
      ? (v: number) => formattedValueToString(colorField.display!(v))
      : (v: number) => `${v}`;
    return (
      <div {...stylex.props(styles.infoWrap)}>
        <div {...stylex.props(styles.layerName)}>{layerName}</div>
        <div {...stylex.props(styles.layerBody, styles.colorScaleWrapper)}>
          <ColorScale
            hoverValue={hoverValue}
            colorPalette={colors}
            min={colorRange.min ?? 0}
            max={colorRange.max ?? 100}
            display={display}
            useStopsPercentage={false}
          />
        </div>
      </div>
    );
  }

  const thresholds = colorField?.config?.thresholds;
  if (!thresholds || thresholds.steps.length < 2) {
    return <div></div>; // don't show anything in the legend
  }

  const items = getThresholdItems(colorField!.config, config.theme2);
  return (
    <div {...stylex.props(styles.infoWrap)}>
      <div {...stylex.props(styles.layerName)}>{layerName}</div>
      <div {...stylex.props(styles.layerBody, styles.legend)}>
        {items.map((item: VizLegendItem, idx: number) => (
          <div key={`${idx}/${item.label}`} {...stylex.props(styles.legendItem)}>
            <i {...mergeStylexProps(stylex.props(styles.legendItemSwatch), { style: { background: item.color } })}></i>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = stylex.create({
  infoWrap: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors['--gf-colors-background-secondary'],
    // eslint-disable-next-line @grafana/stylex-no-border-radius-literal
    borderRadius: '1px',
    padding: spacing['--gf-spacing-x1'],
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-strong'],
    minWidth: '150px',
  },
  layerName: {
    fontSize: typography['--gf-typography-body-font-size'],
  },
  layerBody: {
    paddingLeft: '10px',
  },
  legend: {
    lineHeight: '18px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: typography['--gf-typography-body-small-font-size'],
    paddingTop: '5px',
    paddingRight: '10px',
    paddingBottom: 0,
    paddingLeft: '10px',
  },
  legendItem: {
    whiteSpace: 'nowrap',
  },
  legendItemSwatch: {
    width: '15px',
    height: '15px',
    float: 'left',
    marginRight: '8px',
    opacity: 0.7,
    borderRadius: shape['--gf-shape-radius-circle'],
  },
  fixedColorContainer: {
    minWidth: '80px',
    fontSize: typography['--gf-typography-body-small-font-size'],
    paddingTop: '5px',
  },
  legendSymbol: {
    height: '18px',
    width: '18px',
    margin: 'auto',
  },
  colorScaleWrapper: {
    minWidth: '200px',
    fontSize: typography['--gf-typography-body-small-font-size'],
    paddingTop: '10px',
  },
});
