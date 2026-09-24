import * as stylex from '@stylexjs/stylex';
import { type DetailedHTMLProps, type HTMLAttributes } from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { components, shape } from '../../themes/stylex/tokens.stylex';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

// TODO: Reimplement this with Box
/**
 * @deprecated Use Box instead
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-deprecated-panelcontainer--docs
 */
export const PanelContainer = ({ children, className, style, ...props }: Props) => {
  return (
    <div {...mergeStylexProps(stylex.props(styles.container), { className, style })} {...props}>
      {children}
    </div>
  );
};

const styles = stylex.create({
  container: {
    backgroundColor: components['--gf-components-panel-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
});
