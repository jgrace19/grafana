import * as stylex from '@stylexjs/stylex';

export const spanTreeOffsetStyles = stylex.create({
  SpanTreeOffset: {
    color: '#000',
    position: 'relative',
  },
  SpanTreeOffsetParent: {
    ':hover': {
      cursor: 'pointer',
    },
  },
  indentGuide: {
    paddingRight: '1rem',
    height: '100%',
    display: 'inline-flex',
    transition: 'padding 300ms ease-out',
    '::before': {
      content: '""',
      paddingLeft: '1px',
      backgroundColor: 'lightgrey',
    },
  },
  indentGuideActive: {
    '::before': {
      backgroundColor: '#777',
    },
  },
  indentGuideThin: {
    paddingRight: '0.3rem',
  },
  iconWrapper: {
    position: 'absolute',
    right: 0,
    height: '100%',
    paddingTop: '1px',
    width: '1rem',
    textAlign: 'center',
  },
});
