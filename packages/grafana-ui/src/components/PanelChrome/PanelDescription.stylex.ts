import * as stylex from '@stylexjs/stylex';


export const panelDescriptionStyles = stylex.create({
  description: {
    code: {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
    
          'pre > code': {
            display: 'block',
          },
  },
});

export function panelDescriptionStyleProps(key: keyof typeof panelDescriptionStyles) {
  return stylex.props(panelDescriptionStyles[key]);
}
