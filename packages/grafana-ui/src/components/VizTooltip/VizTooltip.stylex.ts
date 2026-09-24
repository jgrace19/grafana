import * as stylex from '@stylexjs/stylex';


export const vizTooltipStyles = stylex.create({
  portal: {
    position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
  },
});

export function vizTooltipStyleProps(key: keyof typeof vizTooltipStyles) {
  return stylex.props(vizTooltipStyles[key]);
}
