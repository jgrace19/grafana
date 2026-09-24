import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const layerNameStyles = stylex.create({
  wrapper: {
    label: 'Wrapper',
          display: 'flex',
          alignItems: 'center',
          marginLeft: themeSpacing(0.5),
  },
  layerNameWrapper: {
    display: 'flex',
          cursor: 'pointer',
          border: '1px solid transparent',
          borderRadius: grafanaTokens.shape_radius_default,
          alignItems: 'center',
          padding: `0 0 0 ${themeSpacing(0.5)}`,
          margin: 0,
          background: 'transparent',
    
          ':hover': {
            background: grafanaTokens.colors_action_hover,
            border: `1px dashed ${grafanaTokens.colors_border_strong}`,
          },
    
          '&:focus': {
            border: `2px solid ${grafanaTokens.colors_primary_border}`,
          },
    
          '&:hover, &:focus': {
            '.query-name-edit-icon': {
              visibility: 'visible',
            },
          },
  },
  layerName: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
          color: grafanaTokens.colors_primary_text,
          cursor: 'pointer',
          overflow: 'hidden',
          marginLeft: themeSpacing(0.5),
  },
  layerNameInput: {
    maxWidth: '300px',
          margin: '-4px 0',
  },
});
