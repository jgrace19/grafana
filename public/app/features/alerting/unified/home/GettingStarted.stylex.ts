import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const gettingStartedStyles = stylex.create({
  welcomeCTAButton_container: {
    color: grafanaTokens.colors_text_primary,
        flex: 1,
        minWidth: '160px',
        display: 'grid',
        rowGap: themeSpacing(1),
        gridTemplateColumns: 'min-content 1fr 1fr 1fr',
        gridTemplateRows: 'min-content auto min-content',
    
        '& h2': {
          marginBottom: 0,
          gridColumn: '2 / span 3',
          gridRow: 1,
        },
  },
  welcomeCTAButton_desc: {
    gridColumn: '2 / span 3',
        gridRow: 2,
  },
  welcomeCTAButton_actionRow: {
    gridColumn: '2 / span 3',
        gridRow: 3,
        maxWidth: '240px',
  },
  contentBox_box: {
    padding: themeSpacing(2),
        backgroundColor: grafanaTokens.colors_background_secondary,
        borderRadius: grafanaTokens.shape_radius_lg,
  },
});
