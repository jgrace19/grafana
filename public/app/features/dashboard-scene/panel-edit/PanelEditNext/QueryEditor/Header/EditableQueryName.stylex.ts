import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const editableQueryNameStyles = stylex.create({
  queryNameWrapper: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1.5),
        cursor: 'pointer',
        border: '1px solid transparent',
        borderRadius: grafanaTokens.shape_radius_default,
        padding: themeSpacingShorthand(0, 0.5),
        margin: 0,
        background: 'transparent',
        overflow: 'hidden',
    
        ':hover': {
          background: grafanaTokens.colors_action_hover,
          border: `1px dashed ${grafanaTokens.colors_border_strong}`,
        },
    
        '&:focus-visible': {
          border: `2px solid ${grafanaTokens.colors_primary_border}`,
        },
  },
  queryNameText: {
    display: 'block',
        maxWidth: '180px',
        minWidth: 0,
        overflow: 'hidden',
  },
  queryNameInput: {
    maxWidth: '300px',
    
        input: {
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
        },
  },
  inputRow: {
    position: 'relative',
  },
  queryEditIcon: {
    color: grafanaTokens.colors_text_secondary,
  },
  validationMessage: {
    position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: themeSpacing(0.5),
        whiteSpace: 'normal',
        maxWidth: 'min(360px, 40vw)',
        zIndex: grafanaTokens.zIndex_tooltip,
  },
});
