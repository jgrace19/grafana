import * as stylex from '@stylexjs/stylex';

export const infiniteScrollStyles = stylex.create({
  messageContainer: {
    textAlign: 'center',
    padding: 0.25,
  },
  navButton: {
    width: '58px',
    height: '68px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '1',
    position: 'absolute',
    top: 0,
    right: -3,
    zIndex: 1,
  },
  navButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'normal',
  },
});
