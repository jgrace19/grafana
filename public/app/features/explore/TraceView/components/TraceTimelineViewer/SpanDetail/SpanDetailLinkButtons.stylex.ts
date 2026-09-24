import * as stylex from '@stylexjs/stylex';

const downSm = '@media (max-width: 543.95px)';

export const spanDetailLinkButtonsStyles = stylex.create({
  linkRow: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: '5px',
  },
  responsibleButton: {
    [downSm]: {
      span: { display: 'none' },
    },
  },
});
