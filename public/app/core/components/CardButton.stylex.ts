import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const cardButtonStyles = stylex.create({
  action: {
    display: 'flex',
          flexDirection: 'column',
          height: '100%',
    
          justifySelf: 'center',
          cursor: 'pointer',
          background: grafanaTokens.colors_background_secondary,
          borderRadius: grafanaTokens.shape_radius_default,
          color: grafanaTokens.colors_text_primary,
          border: 'unset',
          width: '100%',
    
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
    
          ':hover': {
            background: /* UNMAPPED theme.colors.emphasize */ 'inherit'(grafanaTokens.colors_background_secondary),
          },
  },
});
