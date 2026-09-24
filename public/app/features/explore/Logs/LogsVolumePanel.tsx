import * as stylex from '@stylexjs/stylex';
import { identity } from 'lodash';
import * as React from 'react';

import {
  type AbsoluteTimeRange,
  type DataQueryResponse,
  LoadingState,
  type SplitOpen,
  type EventBus,
  type DataFrame,
  type TimeRange,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { type TimeZone } from '@grafana/schema';
import { Icon, type SeriesVisibilityChangeMode, Tooltip, TooltipDisplayMode, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getLogsVolumeDataSourceInfo, isLogsVolumeLimited } from '../../logs/utils';
import { ExploreGraph } from '../Graph/ExploreGraph';

type Props = {
  logsVolumeData: DataQueryResponse;
  allLogsVolumeMaximum: number;
  timeRange: TimeRange;
  timeZone: TimeZone;
  splitOpen: SplitOpen;
  width: number;
  onUpdateTimeRange: (timeRange: AbsoluteTimeRange) => void;
  onLoadLogsVolume: () => void;
  onHiddenSeriesChanged: (hiddenSeries: string[]) => void;
  eventBus: EventBus;
  annotations: DataFrame[];
  toggleLegendRef?:
    | React.MutableRefObject<(name: string | undefined, mode: SeriesVisibilityChangeMode) => void>
    | undefined;
};

export function LogsVolumePanel(props: Props) {
  const {
    width,
    timeZone,
    splitOpen,
    onUpdateTimeRange,
    onHiddenSeriesChanged,
    allLogsVolumeMaximum,
    toggleLegendRef,
  } = props;
  const theme = useTheme2();

  const spacing = parseInt(theme.spacing(2).slice(0, -2), 10);
  const height = 150;

  const logsVolumeData = props.logsVolumeData;

  const logsVolumeInfo = getLogsVolumeDataSourceInfo(logsVolumeData?.data);
  let extraInfo = logsVolumeInfo ? `${logsVolumeInfo.name}` : '';

  if (isLogsVolumeLimited(logsVolumeData.data)) {
    extraInfo = [
      extraInfo,
      'This datasource does not support full-range histograms. The graph below is based on the logs seen in the response.',
    ]
      .filter(identity)
      .join('. ');
  }

  let extraInfoComponent = <span>{extraInfo}</span>;

  if (logsVolumeData.state === LoadingState.Streaming) {
    extraInfoComponent = (
      <>
        {extraInfoComponent}
        <Tooltip content={t('explore.logs-volume-panel.content-streaming', 'Streaming')}>
          <Icon name="circle-mono" size="md" xstyle={styles.streaming} data-testid="logs-volume-streaming" />
        </Tooltip>
      </>
    );
  }

  return (
    <div {...mergeStylexProps(stylex.props(styles.contentContainer), { style: { height } })}>
      <ExploreGraph
        toggleLegendRef={toggleLegendRef}
        vizLegendOverrides={{
          calcs: ['sum'],
        }}
        graphStyle="lines"
        loadingState={logsVolumeData.state ?? LoadingState.Done}
        data={logsVolumeData.data}
        height={height}
        width={width - spacing * 2}
        timeRange={props.timeRange}
        onChangeTime={onUpdateTimeRange}
        timeZone={timeZone}
        splitOpenFn={splitOpen}
        tooltipDisplayMode={TooltipDisplayMode.Multi}
        onHiddenSeriesChanged={onHiddenSeriesChanged}
        anchorToZero
        yAxisMaximum={allLogsVolumeMaximum}
        eventBus={props.eventBus}
        annotations={props.annotations}
      />
      {extraInfoComponent && <div {...stylex.props(styles.extraInfoContainer)}>{extraInfoComponent}</div>}
    </div>
  );
}

const styles = stylex.create({
  extraInfoContainer: {
    display: 'flex',
    justifyContent: 'end',
    position: 'absolute',
    right: '5px',
    top: '-10px',
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  streaming: {
    color: colors['--gf-colors-success-text'],
  },
});
