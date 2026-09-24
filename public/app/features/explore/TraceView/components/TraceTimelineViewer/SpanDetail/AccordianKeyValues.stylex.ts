import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const accordianKeyValuesStyles = stylex.create({
  container: {
    textOverflow: 'ellipsis',
  },
  header: {
    label: 'header',
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
    label: 'headerEmpty',
          background: 'none',
          cursor: 'initial',
  },
  headerHighContrast: {
    label: 'headerHighContrast',
          ':hover': {
            background: autoColor(theme, '#ddd'),
          },
  },
  emptyIcon: {
    label: 'emptyIcon',
          color: autoColor(theme, '#aaa'),
  },
  summary: {
    label: 'summary',
          display: 'inline',
          listStyle: 'none',
          padding: 0,
  },
  summaryItem: {
    label: 'summaryItem',
          display: 'inline',
          paddingRight: '0.5rem',
          ':last-child': {
            paddingRight: 0,
            borderRight: 'none',
          },
  },
  summaryLabel: {
    label: 'summaryLabel',
          color: autoColor(theme, '#777'),
          paddingRight: '0.5rem',
  },
});
