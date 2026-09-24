import * as stylex from '@stylexjs/stylex';

export const saveProvisionedDashboardFormStyles = stylex.create({
  container: {
    height: '100%',
    display: 'flex',
  },
  json: {
    flexGrow: 1,
    maxHeight: '800px',
  },
});
