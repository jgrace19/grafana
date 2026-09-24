import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const panZoomHelpStyles = stylex.create({
  alert: {
    '& div': { padding: '4px', alignItems: 'start' },
        marginBottom: '0px',
        marginTop: '5px',
        padding: '2px',
        'ul > li': { marginLeft: '10px' },
  },
});
