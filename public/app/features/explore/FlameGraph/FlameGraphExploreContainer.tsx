import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { flameGraphExploreContainerStyles } from './FlameGraphExploreContainer.stylex';
import { useBooleanFlagValue } from '@openfeature/react-sdk';

import { type DataFrame, type GrafanaTheme2, CoreApp } from '@grafana/data';
import { FlameGraph } from '@grafana/flamegraph';
import { config, reportInteraction } from '@grafana/runtime';

interface Props {
  dataFrames: DataFrame[];
}

function interaction(name: string, context: Record<string, string | number> = {}) {
  reportInteraction(`grafana_flamegraph_${name}`, {
    app: CoreApp.Unknown,
    grafana_version: config.buildInfo.version,
    ...context,
  });
}

export const FlameGraphExploreContainer = (props: Props) => {
  const styles = useStyles2((theme) => getStyles(theme));
  const enableNewUI = useBooleanFlagValue('flameGraphWithCallTree', false);

  return (
    <div {...stylex.props(flameGraphExploreContainerStyles.container)}>
      <FlameGraph
        data={props.dataFrames[0]}
        stickyHeader={true}
        getTheme={() => config.theme2}
        enableNewUI={enableNewUI}
        onTableSymbolClick={() => interaction('table_item_selected')}
        onViewSelected={(view: string) => interaction('view_selected', { view })}
        onTextAlignSelected={(align: string) => interaction('text_align_selected', { align })}
        onTableSort={(sort: string) => interaction('table_sort_selected', { sort })}
      />
    </div>
  );
};

