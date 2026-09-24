import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const logDetailsRowStyles = stylex.create({
  labelType: {
    border: `solid 1px ${grafanaTokens.colors_text_secondary}`,
          color: grafanaTokens.colors_text_secondary,
          borderRadius: grafanaTokens.shape_radius_circle,
          fontSize: themeSpacing(1),
          lineHeight: themeSpacing(1.25),
          height: themeSpacing(1.5),
          width: themeSpacing(1.5),
          display: 'flex',
          justifyContent: 'center',
          verticalAlign: 'middle',
          marginLeft: themeSpacing(1),
  },
  wordBreakAll: {
    wordBreak: 'break-all',
  },
  copyButton: {
    '& > button': {
            gap: 0,
            color: grafanaTokens.colors_text_secondary,
            padding: 0,
            justifyContent: 'center',
            borderRadius: grafanaTokens.shape_radius_circle,
            height: themeSpacing(/* UNMAPPED theme.components.height.sm */ 'inherit'),
            width: themeSpacing(/* UNMAPPED theme.components.height.sm */ 'inherit'),
            svg: {
              margin: 0,
            },
    
            'span > div': {
              top: '-5px',
              '& button': {
                color: grafanaTokens.colors_success_main,
              },
            },
          },
  },
  adjoiningLinkButton: {
    marginLeft: themeSpacing(1),
  },
  wrapLine: {
    whiteSpace: 'pre-wrap',
  },
  logDetailsStats: {
    padding: `0 ${themeSpacing(1)}`,
  },
  logDetailsValue: {
    display: 'flex',
          alignItems: 'center',
          lineHeight: '22px',
    
          '.log-details-value-copy': {
            visibility: 'hidden',
          },
          ':hover': {
            '.log-details-value-copy': {
              visibility: 'visible',
            },
          },
  },
  buttonRow: {
    display: 'flex',
          flexDirection: 'row',
          gap: themeSpacing(0.5),
          marginLeft: themeSpacing(0.5),
  },
});
