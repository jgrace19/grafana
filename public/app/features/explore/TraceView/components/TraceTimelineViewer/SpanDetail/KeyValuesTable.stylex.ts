import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const keyValuesTableStyles = stylex.create({
  KeyValueTable: {
          background: '#fff',
          maxHeight: '450px',
          overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  body: {
          verticalAlign: 'baseline',
  },
  row: {
          '& > td': {
            padding: '0 0.5rem',
            height: '30px',
          },
          '&:nth-child(2n) > td': {
            background: '#f5f5f5',
          },
          [`&:not(:hover) .${copyIconClassName}`]: {
            visibility: 'hidden',
          },
          'a span': {
            color: `${grafanaTokens.colors_text_link} !important`,
          },
          'a:hover span': {
            textDecoration: 'underline',
          },
  },
  keyColumn: {
          color: '#888',
          whiteSpace: 'pre',
          width: '125px',
  },
  copyColumn: {
          textAlign: 'right',
  },
  linkIcon: {
          verticalAlign: 'middle',
          fontWeight: 'bold',
  },
  jsonTable: {
    display: 'inline-block',
  },
});
