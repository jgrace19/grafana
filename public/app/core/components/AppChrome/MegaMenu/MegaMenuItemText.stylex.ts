import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const megaMenuItemTextStyles = stylex.create({
  wrapper: {
    display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        '.pin-icon': {
          visibility: 'hidden',
        },
        '&:hover, &:focus-within': {
          a: {
            width: 'calc(100% - 20px)',
          },
          '.pin-icon': {
            visibility: 'visible',
          },
        },
  },
  wrapperActive: {
    backgroundColor: grafanaTokens.colors_action_selected,
        borderTopRightRadius: grafanaTokens.shape_radius_default,
        borderBottomRightRadius: grafanaTokens.shape_radius_default,
        position: 'relative',
        color: grafanaTokens.colors_text_primary,
    
        '&::before': {
          backgroundImage: grafanaTokens.colors_gradients_brandVertical,
          borderRadius: grafanaTokens.shape_radius_default,
          content: '" "',
          display: 'block',
          height: '100%',
          position: 'absolute',
          transform: 'translateX(-50%)',
          left: 0,
          width: themeSpacing(0.25),
        },
  },
  container: {
    alignItems: 'center',
        color: isActive ? grafanaTokens.colors_text_primary : grafanaTokens.colors_text_secondary,
        height: '100%',
        position: 'relative',
        width: '100%',
    
        '&:hover span, &:focus-visible span': {
          color: grafanaTokens.colors_text_primary,
          textDecoration: 'underline',
        },
    
        '&:focus-visible': {
          boxShadow: 'none',
          outline: `2px solid ${grafanaTokens.colors_primary_main}`,
          outlineOffset: '-2px',
        },
  },
  linkContent: {
    alignItems: 'center',
        display: 'flex',
        gap: '0.5rem',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
  },
});
