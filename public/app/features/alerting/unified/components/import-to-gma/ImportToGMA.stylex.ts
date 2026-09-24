import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const importToGMAStyles = stylex.create({
  previewModal_modal: {
    width: '900px',
        maxWidth: '90vw',
  },
  previewModal_editorContainer: {
    border: `1px solid ${grafanaTokens.colors_border_medium}`,
        borderRadius: grafanaTokens.shape_radius_default,
        overflow: 'hidden',
  },
});
