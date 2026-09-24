import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const keyValuesTableStyles = stylex.create({
  KeyValueTable: {
    label: 'KeyValueTable',
          background: autoColor(theme, '#fff'),
          maxHeight: '450px',
          overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  body: {
    label: 'body',
          verticalAlign: 'baseline',
  },
  row: {
    label: 'row',
          '& > td': {
            padding: '0 0.5rem',
            height: '30px',
          },
          '&:nth-child(2n) > td': {
            background: autoColor(theme, '#f5f5f5'),
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
    label: 'keyColumn',
          color: autoColor(theme, '#888'),
          whiteSpace: 'pre',
          width: '125px',
  },
  copyColumn: {
    label: 'copyColumn',
          textAlign: 'right',
  },
  linkIcon: {
    label: 'linkIcon',
          verticalAlign: 'middle',
          fontWeight: 'bold',
  },
  jsonTable: {
    display: 'inline-block',
  },
});
