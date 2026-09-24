import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const logsTableRowActionButtonsStyles = stylex.create({
  container: {
    background: grafanaTokens.colors_background_secondary,
        boxShadow: grafanaTokens.shadows_z2,
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        left: 0,
        top: 0,
        position: 'absolute',
        zIndex: 1,
  },
  buttonWrapper: {
    height: '100%',
        ':hover': {
          color: grafanaTokens.colors_text_link,
        },
        padding: themeSpacingShorthand(0, 0.5),
        display: 'flex',
        alignItems: 'center',
  },
  inspectButton: {
    borderRadius: grafanaTokens.shape_radius_default,
        display: 'inline-flex',
        margin: 0,
        overflow: 'hidden',
        verticalAlign: 'middle',
        cursor: 'pointer',
        height: '24px',
        width: '20px',
  },
  clipboardButton: {
    lineHeight: '1',
        padding: 0,
        width: '20px',
        cursor: 'pointer',
        height: '24px',
  },
});
