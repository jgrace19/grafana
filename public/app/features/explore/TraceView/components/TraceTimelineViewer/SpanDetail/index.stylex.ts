import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const indexStyles = stylex.create({
  card: {
    ':not(:empty)': {
            border: '1px solid ' + grafanaTokens.colors_border_weak,
            ':hover': {
              border: '1px solid ' + grafanaTokens.colors_border_strong,
            },
          },
          borderRadius: grafanaTokens.shape_radius_md,
          margin: '6px',
          padding: '5px',
  },
  header: {
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0 1rem',
          marginBottom: '0.25rem',
          flexDirection: 'column',
  },
  content: {
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  listWrapper: {
          overflow: 'hidden',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
  },
  list: {
    textAlign: 'left',
  },
  spanDetailComponent: {
          display: 'flex',
          flexDirection: 'column', // On bigger screens display attributes below service name
  },
  serviceNameAndLinks: {
          display: 'flex',
          width: '100%',
          marginBottom: themeSpacing(1),
  },
  operationName: {
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '50%',
          flexGrow: 1,
          flexShrink: 0,
  },
  AccordianWarnings: {
          background: '#fafafa',
          border: `1px solid ${'#e4e4e4'}`,
          marginBottom: '0.25rem',
  },
  AccordianWarningsHeader: {
          background: '#fff7e6',
          padding: '0.25rem 0.5rem',
  },
  AccordianWarningsHeaderOpen: {
          borderBottom: `1px solid ${'#e8e8e8'}`,
  },
  AccordianWarningsLabel: {
          color: '#d36c08',
  },
  Textarea: {
    wordBreak: 'break-all',
          whiteSpace: 'pre',
  },
  linkList: {
    display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: themeSpacing(2),
  },
  debugInfo: {
          display: 'block',
          letterSpacing: '0.25px',
          margin: '0.5em 0 -0.75em',
          textAlign: 'right',
          clear: 'both',
  },
  debugLabel: {
          '&::before': {
            color: '#bbb',
            content: 'attr(data-label)',
          },
  },
  LinkIcon: {
    fontSize: '1.5em',
  },
});
