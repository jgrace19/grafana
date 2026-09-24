import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const helpModalStyles = stylex.create({
  table: {
    borderCollapse: 'separate',
          borderSpacing: themeSpacing(2),
          '& caption': {
            captionSide: 'top',
          },
  },
  keys: {
    textAlign: 'end',
          whiteSpace: 'nowrap',
          minWidth: 83, // To match column widths with the widest
  },
  descriptionWrapper: {
    display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(0.75),
          flexWrap: 'nowrap',
  },
  shortcutTableKey: {
    display: 'inline-block',
          textAlign: 'center',
          marginRight: themeSpacing(0.5),
          padding: '3px 5px',
          lineHeight: '10px',
          verticalAlign: 'middle',
          border: `solid 1px ${grafanaTokens.colors_border_medium}`,
          borderRadius: grafanaTokens.shape_radius_default,
          color: grafanaTokens.colors_text_primary,
          backgroundColor: grafanaTokens.colors_background_secondary,
  },
});
