import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const measureOverlayStyles = stylex.create({
  button: {
    marginLeft: 'auto',
  },
  icon: {
    backgroundColor: grafanaTokens.colors_secondary_main,
        display: 'inline-block',
        height: '19.25px',
        margin: '1px',
        width: '19.25px',
  },
  infoWrap: {
    color: `${/* UNMAPPED theme.colors.text */ 'inherit'}`,
        backgroundColor: grafanaTokens.colors_background_secondary,
        // eslint-disable-next-line @grafana/no-border-radius-literal
        borderRadius: '4px',
        padding: '2px',
  },
  infoWrapClosed: {
    height: '25.25px',
        width: '25.25px',
  },
  rowGroup: {
    display: 'flex',
        justifyContent: 'flex-end',
  },
  unitSelect: {
    minWidth: '200px',
  },
});
