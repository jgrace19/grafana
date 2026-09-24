import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const spanTreeOffsetStyles = stylex.create({
  SpanTreeOffset: {
    label: 'SpanTreeOffset',
        color: autoColor(theme, '#000'),
        position: 'relative',
  },
  SpanTreeOffsetParent: {
    label: 'SpanTreeOffsetParent',
        ':hover': {
          cursor: 'pointer',
        },
  },
  indentGuide: {
    label: 'indentGuide',
        /* The size of the indentGuide is based off of the iconWrapper */
        paddingRight: '1rem',
        height: '100%',
        display: 'inline-flex',
        [theme.transitions.handleMotion('no-preference')]: {
          transition: 'padding 300ms ease-out',
        },
        '&::before': {
          content: '""',
          paddingLeft: '1px',
          backgroundColor: autoColor(theme, 'lightgrey'),
        },
  },
  indentGuideActive: {
    label: 'indentGuideActive',
        '&::before': {
          backgroundColor: autoColor(theme, '#777'),
        },
  },
  indentGuideThin: {
    paddingRight: '0.3rem',
  },
  iconWrapper: {
    label: 'iconWrapper',
        position: 'absolute',
        right: 0,
        height: '100%',
        paddingTop: '1px',
        width: '1rem',
        textAlign: 'center',
  },
});
