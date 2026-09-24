import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const accordianKeyValuesStyles = stylex.create({
  container: {
    textOverflow: 'ellipsis',
  },
  header: {
          cursor: 'pointer',
          overflow: 'hidden',
          padding: '0.25em 0.1em',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
  },
  headerLabel: {
    width: '120px',
          display: 'inline-block',
  },
  headerEmpty: {
          background: 'none',
          cursor: 'initial',
  },
  headerHighContrast: {
          ':hover': {
            background: '#ddd',
          },
  },
  emptyIcon: {
          color: '#aaa',
  },
  summary: {
          display: 'inline',
          listStyle: 'none',
          padding: 0,
  },
  summaryItem: {
          display: 'inline',
          paddingRight: '0.5rem',
          ':last-child': {
            paddingRight: 0,
            borderRight: 'none',
          },
  },
  summaryLabel: {
          color: '#777',
          paddingRight: '0.5rem',
  },
});
