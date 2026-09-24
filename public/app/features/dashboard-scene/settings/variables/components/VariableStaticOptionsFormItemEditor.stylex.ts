import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const variableStaticOptionsFormItemEditorStyles = stylex.create({
  dragIcon: {
    cursor: 'grab',
    
        // create a focus ring around the whole row when the drag handle is tab-focused
        // needs position: relative on the drag row to work correctly
        '&:focus-visible&:after': {
          bottom: 0,
          content: '""',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          outline: `2px solid ${grafanaTokens.colors_primary_main}`,
          outlineOffset: '-2px',
        },
  },
});
