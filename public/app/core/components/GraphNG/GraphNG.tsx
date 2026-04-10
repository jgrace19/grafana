import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { type default as uPlot, type AlignedData } from 'uplot';

import {
  type DataFrame,
  type DataLinkPostProcessor,
  type Field,
  FieldMatcherID,
  fieldMatchers,
  FieldType,
  getLinksSupplier,
  type InterpolateFunction,
  type TimeRange,
  type TimeZone,
} from '@grafana/data';
import { type DashboardCursorSync, type VizLegendOptions } from '@grafana/schema';
import { useTheme2, VizLayout, type VizLayoutLegendProps } from '@grafana/ui';
import {
  type AxisProps,
  pluginLog,
  type Renderers,
  type ScaleProps,
  UPlotChart,
  type UPlotConfigBuilder,
} from '@grafana/ui/internal';

import { type GraphNGLegendEvent, type XYFieldMatchers } from './types';
import { preparePlotFrame as defaultPreparePlotFrame } from './utils';

/**
 * @internal -- not a public API
 */
export type PropDiffFn<T extends Record<string, unknown> = {}> = (prev: T, next: T) => boolean;

export interface GraphNGProps {
  frames: DataFrame[];
  structureRev?: number; // a number that will change when the frames[] structure changes
  width: number;
  height: number;
  timeRange: TimeRange;
  timeZone: TimeZone[] | TimeZone;
  legend: VizLegendOptions;
  fields?: XYFieldMatchers; // default will assume timeseries data
  renderers?: Renderers;
  tweakScale?: (opts: ScaleProps, forField: Field) => ScaleProps;
  tweakAxis?: (opts: AxisProps, forField: Field) => AxisProps;
  onLegendClick?: (event: GraphNGLegendEvent) => void;
  children?: (builder: UPlotConfigBuilder, alignedFrame: DataFrame) => React.ReactNode;
  prepConfig: (
    alignedFrame: DataFrame,
    allFrames: DataFrame[],
    getTimeRange: () => TimeRange,
    annotationLanes?: number
  ) => UPlotConfigBuilder;
  propsToDiff?: Array<string | PropDiffFn>;
  preparePlotFrame?: (frames: DataFrame[], dimFields: XYFieldMatchers) => DataFrame | null;
  renderLegend: (config: UPlotConfigBuilder) => React.ReactElement<VizLayoutLegendProps> | null;
  replaceVariables: InterpolateFunction;
  dataLinkPostProcessor?: DataLinkPostProcessor;
  cursorSync?: DashboardCursorSync;

  // Remove fields that are hidden from the visualization before rendering
  omitHideFromViz?: boolean;

  /**
   * needed for propsToDiff to re-init the plot & config
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>;

  // Annotation lanes count
  annotationLanes?: number;
}

function sameProps<T extends Record<string, unknown>>(
  prevProps: T,
  nextProps: T,
  propsToDiff: Array<string | PropDiffFn> = []
) {
  for (const propName of propsToDiff) {
    if (typeof propName === 'function') {
      if (!propName(prevProps, nextProps)) {
        return false;
      }
    } else if (nextProps[propName] !== prevProps[propName]) {
      return false;
    }
  }

  return true;
}

/**
 * @internal -- not a public API
 */
export interface GraphNGState {
  alignedFrame: DataFrame;
  alignedData?: AlignedData;
  config?: UPlotConfigBuilder;
}

const defaultMatchers = {
  x: fieldMatchers.get(FieldMatcherID.firstTimeField).get({}),
  y: fieldMatchers.get(FieldMatcherID.byTypes).get(new Set([FieldType.number, FieldType.enum])),
};

function prepareState(
  props: GraphNGProps,
  currentConfig: UPlotConfigBuilder | undefined,
  getTimeRange: () => TimeRange,
  withConfig = true
): GraphNGState | null {
  const { frames, fields = defaultMatchers, preparePlotFrame, replaceVariables, dataLinkPostProcessor, timeZone } =
    props;

  const preparePlotFrameFn = preparePlotFrame ?? defaultPreparePlotFrame;

  const withLinks = frames.some((frame) => frame.fields.some((field) => (field.config.links?.length ?? 0) > 0));

  const alignedFrame = preparePlotFrameFn(
    frames,
    {
      ...fields,
      y: withLinks ? () => true : fields.y,
    },
    props.timeRange
  );

  pluginLog('GraphNG', false, 'data aligned', alignedFrame);

  if (alignedFrame) {
    let alignedFrameFinal = alignedFrame;

    if (withLinks) {
      const tz = Array.isArray(timeZone) ? timeZone[0] : timeZone;

      let linkFrames = frames.map((frame, frameIdx) => ({
        ...frame,
        fields: alignedFrame.fields.filter(
          (field, fieldIdx) => fieldIdx === 0 || field.state?.origin?.frameIndex === frameIdx
        ),
        length: alignedFrame.length,
      }));

      linkFrames.forEach((linkFrame, frameIndex) => {
        linkFrame.fields.forEach((field) => {
          field.getLinks = getLinksSupplier(
            linkFrame,
            field,
            {
              ...field.state?.scopedVars,
              __dataContext: {
                value: {
                  data: linkFrames,
                  field: field,
                  frame: linkFrame,
                  frameIndex,
                },
              },
            },
            replaceVariables,
            tz,
            dataLinkPostProcessor
          );
        });
      });

      alignedFrameFinal = {
        ...alignedFrame,
        fields: alignedFrame.fields.filter((field, i) => i === 0 || fields.y(field, alignedFrame, [alignedFrame])),
      };
    }

    if (props.omitHideFromViz) {
      const nonHiddenFields = alignedFrameFinal.fields.filter((field) => field.config.custom?.hideFrom?.viz !== true);
      alignedFrameFinal = {
        ...alignedFrameFinal,
        fields: nonHiddenFields,
        length: nonHiddenFields.length,
      };
    }

    let config = currentConfig;

    if (withConfig) {
      config = props.prepConfig(alignedFrameFinal, props.frames, getTimeRange, props.annotationLanes);
      pluginLog('GraphNG', false, 'config prepared', config);
    }

    return {
      alignedFrame: alignedFrameFinal,
      config,
    };
  }

  return null;
}

/**
 * "Time as X" core component, expects ascending x
 */
export function GraphNG(props: GraphNGProps) {
  const { width, height, children, renderLegend, frames, structureRev, timeZone, cursorSync, propsToDiff } = props;

  useTheme2(); // ensure theme is available

  const plotInstance = useRef<uPlot | null>(null);
  const timeRangeRef = useRef(props.timeRange);
  timeRangeRef.current = props.timeRange;

  const getTimeRange = useCallback(() => timeRangeRef.current, []);

  const initialState = useMemo(() => {
    const state = prepareState(props, undefined, getTimeRange, true);
    if (state) {
      state.alignedData = state.config!.prepData!([state.alignedFrame]) as AlignedData;
    }
    return state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [graphState, setGraphState] = useState<GraphNGState | null>(initialState);

  const prevPropsRef = useRef<GraphNGProps>(props);

  // Update state when props change (componentDidUpdate equivalent)
  const prevProps = prevPropsRef.current;
  prevPropsRef.current = props;

  const propsChanged = !sameProps(
    prevProps as unknown as Record<string, unknown>,
    props as unknown as Record<string, unknown>,
    propsToDiff
  );

  if (
    frames !== prevProps.frames ||
    propsChanged ||
    timeZone !== prevProps.timeZone ||
    cursorSync !== prevProps.cursorSync
  ) {
    const newState = prepareState(props, graphState?.config, getTimeRange, false);

    if (newState) {
      const shouldReconfig =
        graphState?.config === undefined ||
        timeZone !== prevProps.timeZone ||
        cursorSync !== prevProps.cursorSync ||
        structureRev !== prevProps.structureRev ||
        !structureRev ||
        propsChanged;

      if (shouldReconfig) {
        newState.config = props.prepConfig(
          newState.alignedFrame,
          frames,
          getTimeRange,
          props.annotationLanes
        );
        pluginLog('GraphNG', false, 'config recreated', newState.config);
      }

      newState.alignedData = newState.config!.prepData!([newState.alignedFrame]) as AlignedData;

      if (
        newState.alignedFrame !== graphState?.alignedFrame ||
        newState.config !== graphState?.config ||
        newState.alignedData !== graphState?.alignedData
      ) {
        setGraphState(newState);
      }
    }
  }

  if (!graphState?.config) {
    return null;
  }

  const { config, alignedFrame, alignedData } = graphState;

  return (
    <VizLayout width={width} height={height} legend={renderLegend(config)}>
      {(vizWidth: number, vizHeight: number) => (
        <UPlotChart
          config={config}
          data={alignedData!}
          width={vizWidth}
          height={vizHeight}
          plotRef={(u) => {
            plotInstance.current = u;
          }}
        >
          {children ? children(config, alignedFrame) : null}
        </UPlotChart>
      )}
    </VizLayout>
  );
}
