import { useCallback, useMemo, useState } from 'react';
import { useToggle } from 'react-use';

import {
  type DataFrame,
  type EventBus,
  type AbsoluteTimeRange,
  type TimeZone,
  type SplitOpen,
  type LoadingState,
  type ThresholdsConfig,
  type TimeRange,
} from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { type GraphThresholdsStyleConfig, Icon, PanelChrome, type PanelChromeProps, Stack, Tooltip } from '@grafana/ui';
import { type ExploreGraphScale, type ExploreGraphStyle } from 'app/types/explore';

import { LimitedDataDisclaimer } from '../LimitedDataDisclaimer';
import { storeGraphStyle } from '../state/utils';

import { ExploreGraph } from './ExploreGraph';
import { ExploreGraphLabel } from './ExploreGraphLabel';
import { ExploreGraphScaleLabel } from './ExploreGraphScaleLabel';
import { loadGraphScale, loadGraphStyle, storeGraphScale } from './utils';

const MAX_NUMBER_OF_TIME_SERIES = 20;

interface Props extends Pick<PanelChromeProps, 'statusMessage'> {
  width: number;
  height: number;
  data: DataFrame[];
  annotations?: DataFrame[];
  eventBus: EventBus;
  timeRange: TimeRange;
  timeZone: TimeZone;
  onChangeTime: (absoluteRange: AbsoluteTimeRange) => void;
  splitOpenFn: SplitOpen;
  loadingState: LoadingState;
  thresholdsConfig?: ThresholdsConfig;
  thresholdsStyle?: GraphThresholdsStyleConfig;
  queriesChangedIndexAtRun?: number;
}

export const GraphContainer = ({
  data,
  eventBus,
  height,
  width,
  timeRange,
  timeZone,
  annotations,
  onChangeTime,
  splitOpenFn,
  thresholdsConfig,
  thresholdsStyle,
  loadingState,
  statusMessage,
  queriesChangedIndexAtRun,
}: Props) => {
  const [showAllSeries, toggleShowAllSeries] = useToggle(false);
  const [graphStyle, setGraphStyle] = useState(loadGraphStyle);
  const [graphScale, setGraphScale] = useState(loadGraphScale);
  const [isLogScaleFallback, setIsLogScaleFallback] = useState(false);

  const onGraphStyleChange = useCallback((graphStyle: ExploreGraphStyle) => {
    storeGraphStyle(graphStyle);
    setGraphStyle(graphStyle);
  }, []);

  const onGraphScaleChange = useCallback((scale: ExploreGraphScale) => {
    storeGraphScale(scale);
    setGraphScale(scale);
  }, []);

  const onLogScaleFallback = useCallback((isFallback: boolean) => {
    setIsLogScaleFallback(isFallback);
  }, []);

  const slicedData = useMemo(() => {
    return showAllSeries ? data : data.slice(0, MAX_NUMBER_OF_TIME_SERIES);
  }, [data, showAllSeries]);

  return (
    <PanelChrome
      title={t('graph.container.title', 'Graph')}
      titleItems={[
        !showAllSeries && MAX_NUMBER_OF_TIME_SERIES < data.length && (
          <LimitedDataDisclaimer
            key="disclaimer"
            toggleShowAllSeries={toggleShowAllSeries}
            info={
              <Trans i18nKey={'graph.container.show-only-series'}>
                Showing only {{ MAX_NUMBER_OF_TIME_SERIES }} series
              </Trans>
            }
            buttonLabel={<Trans i18nKey={'graph.container.show-all-series'}>Show all {{ length: data.length }}</Trans>}
            tooltip={t(
              'graph.container.content',
              'Rendering too many series in a single panel may impact performance and make data harder to read. Consider refining your queries.'
            )}
          />
        ),
        isLogScaleFallback && (
          <Tooltip
            key="log-scale-warning"
            content={t(
              'graph.container.log-scale-fallback',
              'Data contains zero or negative values. Falling back to linear scale.'
            )}
          >
            <span style={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
              <Icon name="exclamation-triangle" style={{ color: 'var(--warning-text-color)' }} />
            </span>
          </Tooltip>
        ),
      ].filter(Boolean)}
      width={width}
      height={height}
      loadingState={loadingState}
      statusMessage={statusMessage}
      actions={
        <Stack gap={1}>
          <ExploreGraphLabel graphStyle={graphStyle} onChangeGraphStyle={onGraphStyleChange} />
          <ExploreGraphScaleLabel graphScale={graphScale} onChangeGraphScale={onGraphScaleChange} />
        </Stack>
      }
    >
      {(innerWidth, innerHeight) => (
        <ExploreGraph
          graphStyle={graphStyle}
          graphScale={graphScale}
          onLogScaleFallback={onLogScaleFallback}
          data={slicedData}
          height={innerHeight}
          width={innerWidth}
          timeRange={timeRange}
          onChangeTime={onChangeTime}
          timeZone={timeZone}
          annotations={annotations}
          splitOpenFn={splitOpenFn}
          loadingState={loadingState}
          thresholdsConfig={thresholdsConfig}
          thresholdsStyle={thresholdsStyle}
          eventBus={eventBus}
          queriesChangedIndexAtRun={queriesChangedIndexAtRun}
        />
      )}
    </PanelChrome>
  );
};
