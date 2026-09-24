import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const indexStyles = stylex.create({
  TraceTimelineViewer: {
        borderBottom: `1px solid ${'#bbb'}`,
    
        '& .json-markup': {
          lineHeight: '17px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        },
    
        '& .json-markup-key': {
          fontWeight: 'bold',
        },
    
        '& .json-markup-bool': {
          color: 'firebrick',
        },
    
        '& .json-markup-string': {
          color: 'teal',
        },
    
        '& .json-markup-null': {
          color: 'teal',
        },
    
        '& .json-markup-number': {
          color: 'blue',
        },
  },
});
