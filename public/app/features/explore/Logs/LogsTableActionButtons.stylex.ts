import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const logsTableActionButtonsStyles = stylex.create({
  iconWrapper: {
    background: grafanaTokens.colors_background_secondary,
        boxShadow: grafanaTokens.shadows_z2,
        display: 'flex',
        flexDirection: 'row',
        height: '35px',
        left: 0,
        top: 0,
        padding: 0,
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        // Fix switching icon direction when cell is numeric (rtl)
        direction: 'ltr',
  },
  icon: {
    gap: 0,
        margin: 0,
        padding: 0,
        borderRadius: grafanaTokens.shape_radius_default,
        width: '28px',
        height: '32px',
        display: 'inline-flex',
        justifyContent: 'center',
    
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 24,
          height: 24,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          borderRadius: grafanaTokens.shape_radius_default,
          backgroundColor: grafanaTokens.colors_background_primary,
          zIndex: -1,
          opacity: 0,
                      transitionDuration: '0.2s',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionProperty: 'opacity',
          },
        },
        ':hover': {
          color: grafanaTokens.colors_text_link,
          cursor: 'pointer',
          background: 'none',
          '&:before': {
            opacity: 1,
          },
        },
  },
});
