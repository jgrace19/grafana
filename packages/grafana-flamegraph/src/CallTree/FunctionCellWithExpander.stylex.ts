import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const functionCellStyles = stylex.create({
  functionCellContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    height: '20px',
    lineHeight: 1,
    overflow: 'hidden',
    minWidth: 0,
  },
  treeConnector: {
    color: grafanaTokens.colors_text_secondary,
    fontSize: '16px',
    lineHeight: 1,
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: 0,
  },
  functionNameWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    overflow: 'hidden',
    minWidth: 0,
  },
  functionButton: {
    padding: 0,
    fontSize: grafanaTokens.typography_size_md,
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
    flexShrink: 1,
  },
  nodeBadge: {
    marginLeft: grafanaTokens.spacing_x0_5,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    color: grafanaTokens.colors_text_secondary,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
});
