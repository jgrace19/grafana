import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { vizWrapperStyles } from './VizWrapper.stylex';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Trans } from '@grafana/i18n';
import { type GraphThresholdsStyleMode } from '@grafana/schema';
import { appEvents } from 'app/core/app_events';
import { GraphContainer } from 'app/features/explore/Graph/GraphContainer';

import { ExpressionResult } from '../expressions/Expression';

import { getStatusMessage } from './util';

interface Props {
  data: PanelData;
  thresholds?: ThresholdsConfig;
  thresholdsType?: GraphThresholdsStyleMode;
}

/** The VizWrapper is just a simple component that renders either a table or a graph based on the type of data we receive from "PanelData" */
export const VizWrapper = ({ data, thresholds, thresholdsType }: Props) => {
  const isTimeSeriesData = isTimeSeriesFrames(data.series);
  const statusMessage = getStatusMessage(data);
  const thresholdsStyle = thresholdsType ? { mode: thresholdsType } : undefined;

  return (
    <div {...stylex.props(vizWrapperStyles.wrapper)}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <div style={{ width }}>
            {isTimeSeriesData ? (
              <GraphContainer
                statusMessage={statusMessage}
                data={data.series}
                eventBus={appEvents}
                height={300}
                width={width}
                timeRange={data.timeRange}
                timeZone="browser"
                onChangeTime={() => {}}
                splitOpenFn={() => {}}
                loadingState={data.state}
                thresholdsConfig={thresholds}
                thresholdsStyle={thresholdsStyle}
              />
            ) : (
              <div {...stylex.props(vizWrapperStyles.instantVectorResultWrapper)}>
                <header {...stylex.props(vizWrapperStyles.title)}>
                  <Trans i18nKey="alerting.viz-wrapper.table">Table</Trans>
                </header>
                <ExpressionResult series={data.series} />
              </div>
            )}
          </div>
        )}
      </AutoSizer>
    </div>
  );
};

