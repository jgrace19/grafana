import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

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
    label: 'SpanDetailHeader',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0 1rem',
          marginBottom: '0.25rem',
          flexDirection: 'column',
  },
  content: {
    label: 'SpanDetailContent',
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  listWrapper: {
    label: 'SpanDetailListWrapper',
          overflow: 'hidden',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
  },
  list: {
    textAlign: 'left',
  },
  spanDetailComponent: {
    label: 'SpanDetailComponent',
          display: 'flex',
          flexDirection: 'column', // On bigger screens display attributes below service name
  },
  serviceNameAndLinks: {
    label: 'ServiceNameAndLinks',
          display: 'flex',
          width: '100%',
          marginBottom: themeSpacing(1),
  },
  operationName: {
    label: 'SpanDetailOperationName',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '50%',
          flexGrow: 1,
          flexShrink: 0,
  },
  AccordianWarnings: {
    label: 'AccordianWarnings',
          background: autoColor(theme, '#fafafa'),
          border: `1px solid ${autoColor(theme, '#e4e4e4')}`,
          marginBottom: '0.25rem',
  },
  AccordianWarningsHeader: {
    label: 'AccordianWarningsHeader',
          background: autoColor(theme, '#fff7e6'),
          padding: '0.25rem 0.5rem',
  },
  AccordianWarningsHeaderOpen: {
    label: 'AccordianWarningsHeaderOpen',
          borderBottom: `1px solid ${autoColor(theme, '#e8e8e8')}`,
  },
  AccordianWarningsLabel: {
    label: 'AccordianWarningsLabel',
          color: autoColor(theme, '#d36c08'),
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
    label: 'debugInfo',
          display: 'block',
          letterSpacing: '0.25px',
          margin: '0.5em 0 -0.75em',
          textAlign: 'right',
          clear: 'both',
  },
  debugLabel: {
    label: 'debugLabel',
          '&::before': {
            color: autoColor(theme, '#bbb'),
            content: 'attr(data-label)',
          },
  },
  LinkIcon: {
    fontSize: '1.5em',
  },
});
