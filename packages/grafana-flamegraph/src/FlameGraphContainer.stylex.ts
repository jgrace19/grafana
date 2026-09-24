import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { FLAMEGRAPH_CONTAINER_HEIGHT } from './constants';

export const flameGraphContainerStyles = stylex.create({
  container: {
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minHeight: 0,
    gap: grafanaTokens.spacing_x1,
  },
  body: {
    flexGrow: 1,
  },
  tableContainer: {
    height: FLAMEGRAPH_CONTAINER_HEIGHT,
  },
  horizontalContainer: {
    display: 'flex',
    minHeight: 0,
    flexDirection: 'row',
    columnGap: grafanaTokens.spacing_x1,
    width: '100%',
  },
  horizontalGraphContainer: {
    flexBasis: '50%',
  },
  horizontalTableContainer: {
    flexBasis: '50%',
    maxHeight: FLAMEGRAPH_CONTAINER_HEIGHT,
  },
  verticalGraphContainer: {
    marginBottom: grafanaTokens.spacing_x1,
  },
  verticalTableContainer: {
    height: FLAMEGRAPH_CONTAINER_HEIGHT,
  },
  verticalContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  horizontalPaneContainer: {
    flexBasis: '50%',
    maxHeight: FLAMEGRAPH_CONTAINER_HEIGHT,
    minWidth: 0,
    overflow: 'auto',
  },
  verticalPaneContainer: {
    marginBottom: grafanaTokens.spacing_x1,
    height: FLAMEGRAPH_CONTAINER_HEIGHT,
  },
});
