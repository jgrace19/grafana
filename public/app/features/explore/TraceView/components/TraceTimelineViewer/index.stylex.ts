import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const indexStyles = stylex.create({
  TraceTimelineViewer: {
    label: 'TraceTimelineViewer',
        borderBottom: `1px solid ${autoColor(theme, '#bbb')}`,
    
        '& .json-markup': {
          lineHeight: '17px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        },
    
        '& .json-markup-key': {
          fontWeight: 'bold',
        },
    
        '& .json-markup-bool': {
          color: autoColor(theme, 'firebrick'),
        },
    
        '& .json-markup-string': {
          color: autoColor(theme, 'teal'),
        },
    
        '& .json-markup-null': {
          color: autoColor(theme, 'teal'),
        },
    
        '& .json-markup-number': {
          color: autoColor(theme, 'blue', 'black'),
        },
  },
});
