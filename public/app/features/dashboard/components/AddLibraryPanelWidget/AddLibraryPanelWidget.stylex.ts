import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const addLibraryPanelWidgetStyles = stylex.create({
  wrapper: {
    height: '100%',
          paddingTop: `${themeSpacing(0.5)}`,
  },
  headerRow: {
    display: 'flex',
          alignItems: 'center',
          height: '38px',
          flexShrink: 0,
          width: '100%',
          fontSize: grafanaTokens.typography_fontSize,
          fontWeight: grafanaTokens.typography_fontWeightMedium,
          paddingLeft: `${themeSpacing(1)}`,
          [theme.transitions.handleMotion('no-preference', 'reduce')]: {
            transition: 'background-color 0.1s ease-in-out',
          },
          cursor: 'move',
    
          ':hover': {
            background: `${grafanaTokens.colors_background_secondary}`,
          },
  },
  callToAction: {
    backgroundColor: theme.components.panel.background,
          border: `1px solid ${theme.components.panel.borderColor}`,
          borderRadius: grafanaTokens.shape_radius_default,
          display: 'flex',
          flex: '1 1 0',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          width: '100%',
          outline: '2px dotted transparent',
          outlineOffset: '2px',
          overflow: 'hidden',
    
          [theme.transitions.handleMotion('no-preference', 'reduce')]: {
            animation: `${pulsate} 2s ease infinite`,
          },
  },
});
