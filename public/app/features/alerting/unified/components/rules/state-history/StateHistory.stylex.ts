import * as stylex from '@stylexjs/stylex';

export const stateHistoryStyles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  timestamp: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
});
