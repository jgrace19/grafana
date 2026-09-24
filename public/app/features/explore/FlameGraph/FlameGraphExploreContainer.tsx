import { useBooleanFlagValue } from '@openfeature/react-sdk';
import * as stylex from '@stylexjs/stylex';

import { type DataFrame, CoreApp } from '@grafana/data';
import { FlameGraph } from '@grafana/flamegraph';
import { config, reportInteraction } from '@grafana/runtime';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
  const enableNewUI = useBooleanFlagValue('flameGraphWithCallTree', false);

  return (
    <div {...stylex.props(styles.container)}>
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

const styles = stylex.create({
  container: {
    backgroundColor: colors['--gf-colors-background-primary'],
    display: 'flow-root',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
});
