import * as stylex from '@stylexjs/stylex';


export const paginationStyles = stylex.create({
  container: {
    float: 'right',
  },
  item: {
    display: 'inline-block',
          paddingLeft: '10px',
          marginBottom: '5px',
  },
  ellipsis: {
    transform: 'rotate(90deg)',
  },
});

export function paginationStyleProps(key: keyof typeof paginationStyles) {
  return stylex.props(paginationStyles[key]);
}
