import * as stylex from '@stylexjs/stylex';


export const vizLegendStatsListStyles = stylex.create({
  list: {
    flexGrow: 1,
        textAlign: 'right',
  },
  item: {
    marginLeft: '8px',
  },
});

export function vizLegendStatsListStyleProps(key: keyof typeof vizLegendStatsListStyles) {
  return stylex.props(vizLegendStatsListStyles[key]);
}
