// eslint-disable-next-line no-restricted-imports -- stylex: pending dashboard-scene SaveLibraryVizPanelModal and Modal migration
import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';

/**
 * @deprecated Still used by dashboard-scene's library panel save modal. Library panel modals use the StyleX
 * `modalStyles`, plus `modalWidthClassName`.
 */
export function getModalStyles(theme: GrafanaTheme2) {
  return {
    myTable: css({
      maxHeight: '204px',
      overflowY: 'auto',
      marginTop: '11px',
      marginBottom: '28px',
      borderRadius: theme.shape.radius.default,
      border: `1px solid ${theme.colors.action.hover}`,
      background: theme.colors.background.primary,
      color: theme.colors.text.secondary,
      fontSize: theme.typography.h6.fontSize,
      width: '100%',

      thead: {
        color: '#538ade',
        fontSize: theme.typography.bodySmall.fontSize,
      },

      'th, td': {
        padding: '6px 13px',
        height: theme.spacing(4),
      },

      'tbody > tr:nth-child(odd)': {
        background: theme.colors.background.secondary,
      },
    }),
    noteTextbox: css({
      marginBottom: theme.spacing(4),
    }),
    textInfo: css({
      color: theme.colors.text.secondary,
      fontSize: theme.typography.size.sm,
    }),
    dashboardSearch: css({
      marginTop: theme.spacing(2),
    }),
    modal: css({
      width: '500px',
    }),
    modalText: css({
      fontSize: theme.typography.h4.fontSize,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing(4),
      paddingTop: theme.spacing(2),
    }),
  };
}

// stylex: pending Modal migration. Modal's own Emotion width would beat a layered StyleX class.
export const modalWidthClassName = css({
  width: '500px',
});
