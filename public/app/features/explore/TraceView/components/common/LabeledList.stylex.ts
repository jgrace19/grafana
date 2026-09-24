import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const labeledListStyles = stylex.create({
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: grafanaTokens.typography_size_sm,
  },
  listWithDivider: {
    marginRight: '-8px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  item: {
    display: 'inline-block',
    padding: '0 4px',
  },
  itemDivider: {
    borderRight: `1px solid ${grafanaTokens.colors_border_medium}`,
    padding: '0 8px',
  },
  label: {
    color: grafanaTokens.colors_text_secondary,
    marginRight: '0.25rem',
  },
  value: {
    marginRight: '0.55rem',
    wordWrap: 'break-word',
    wordBreak: 'break-all',
  },
  valueDivider: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
  },
  icon: {
    marginRight: '0.25rem',
    marginTop: '-0.1rem',
  },
  serviceLine: {
    display: 'inline-block',
    width: '1rem',
    height: '0.35rem',
    marginRight: '0.5rem',
    verticalAlign: 'middle',
    borderRadius: grafanaTokens.shape_radius_default,
  },
});
