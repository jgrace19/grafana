import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { type PopoverContent } from '../Tooltip/types';

import { type LabelProps } from './Label';

export interface Props extends Omit<LabelProps, 'css' | 'description' | 'category'> {
  /** Content for the labels tooltip. If provided, an info icon with the tooltip content
   * will be displayed */
  tooltip?: PopoverContent;
  /** Custom width for the label */
  width?: number | 'auto';
  /** Make labels's background transparent */
  transparent?: boolean;
  /** Make tooltip interactive */
  interactive?: boolean;
  /** @beta */
  /** Controls which element the InlineLabel should be rendered into */
  as?: React.ElementType;
}

/**
 * A horizontal variant of Label, primarily used in query editors. Can be combined with form components that expect a label, eg. `Input`, `Checkbox`, `Combobox`.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/forms-inlinelabel--docs
 */
export const InlineLabel = ({
  children,
  className,
  tooltip,
  width,
  transparent,
  interactive,
  as: Component = 'label',
  xstyle,
  ...rest
}: Props) => {
  return (
    <Component
      {...mergeStylexProps(
        stylex.props(
          styles.label,
          transparent && styles.transparent,
          width === 'auto' && styles.autoWidth,
          typeof width === 'number' && width !== 0 && styles.width(`${8 * width}px`),
          xstyle
        ),
        { className }
      )}
      {...rest}
    >
      {children}
      {tooltip && (
        <Tooltip interactive={interactive} placement="top" content={tooltip} theme="info">
          <Icon tabIndex={0} name="info-circle" size="sm" xstyle={styles.icon} />
        </Tooltip>
      )}
    </Component>
  );
};

const labelHeight = `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`;

const styles = stylex.create({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-sm'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    height: labelHeight,
    lineHeight: labelHeight,
    marginRight: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderStyle: 'none',
    width: '100%',
    color: colors['--gf-colors-text-primary'],
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  autoWidth: {
    width: 'auto',
  },
  width: (width: string) => ({ width }),
  icon: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    marginLeft: '10px',
  },
});
