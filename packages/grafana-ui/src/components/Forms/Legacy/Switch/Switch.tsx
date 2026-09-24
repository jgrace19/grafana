import { Placement } from '@popperjs/core';
import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { uniqueId } from 'lodash';
import { PureComponent } from 'react';
import * as React from 'react';

import { motion } from '../../../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing, v1 } from '../../../../themes/stylex/tokens.stylex';
import { Icon } from '../../../Icon/Icon';
import { Tooltip } from '../../../Tooltip/Tooltip';

import { legacySwitchInputMarker } from './markers.stylex';

export interface Props {
  label: string;
  checked: boolean;
  disabled?: boolean;
  className?: string;
  labelClass?: string;
  switchClass?: string;
  tooltip?: string;
  tooltipPlacement?: Placement;
  transparent?: boolean;
  onChange: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}

export interface State {
  id: string;
}

/** @deprecated Please use the `Switch` component, {@link https://developers.grafana.com/ui/latest/index.html?path=/story/forms-switch--controlled as seen in Storybook} */
class UnthemedSwitch extends PureComponent<Props, State> {
  state = {
    id: uniqueId(),
  };

  internalOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.stopPropagation();
    this.props.onChange(event);
  };

  render() {
    const {
      labelClass = '',
      switchClass = '',
      label,
      checked,
      disabled,
      transparent,
      className,
      tooltip,
      tooltipPlacement,
    } = this.props;

    const labelId = this.state.id;
    const labelClassName = `gf-form-label ${labelClass} ${transparent ? 'gf-form-label--transparent' : ''} pointer`;

    return (
      <div {...stylex.props(styles.container)}>
        <label
          htmlFor={labelId}
          {...mergeStylexProps(stylex.props(styles.labelContainer), { className: clsx('gf-form', className) })}
        >
          {label && (
            <div className={labelClassName}>
              {label}
              {tooltip && (
                <Tooltip placement={tooltipPlacement ? tooltipPlacement : 'auto'} content={tooltip} theme={'info'}>
                  <Icon name="info-circle" size="sm" style={{ marginLeft: '10px' }} />
                </Tooltip>
              )}
            </div>
          )}
          <div
            {...mergeStylexProps(stylex.props(styles.switch, transparent && styles.switchTransparent), {
              className: switchClass,
            })}
          >
            <input
              {...stylex.props(styles.input, legacySwitchInputMarker)}
              disabled={disabled}
              id={labelId}
              type="checkbox"
              checked={checked}
              onChange={this.internalOnChange}
            />
            <span {...stylex.props(styles.slider)} />
          </div>
        </label>
      </div>
    );
  }
}

export const Switch: React.FunctionComponent<Props> = (props) => <UnthemedSwitch {...props} />;

const styles = stylex.create({
  container: {
    display: 'flex',
    flexShrink: 0,
  },
  labelContainer: {
    display: 'flex',
    cursor: 'pointer',
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  switch: {
    display: 'flex',
    position: 'relative',
    width: '56px',
    height: spacing['--gf-spacing-x4'],
    backgroundColor: components['--gf-components-input-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-input-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTransparent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '40px',
  },
  input: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    backgroundColor: {
      default: v1['--gf-v1-palette-gray1'],
      [stylex.when.siblingBefore(':checked', legacySwitchInputMarker)]: colors['--gf-colors-primary-main'],
    },
    borderRadius: shape['--gf-shape-radius-pill'],
    height: '16px',
    width: '32px',
    display: 'block',
    position: 'relative',
    '::before': {
      position: 'absolute',
      content: "''",
      height: '12px',
      width: '12px',
      left: '2px',
      top: '2px',
      backgroundColor: components['--gf-components-input-background'],
      transitionProperty: { default: null, [motion.noPreference]: 'all' },
      transitionDuration: { default: null, [motion.noPreference]: '0.4s' },
      transitionTimingFunction: { default: null, [motion.noPreference]: 'ease' },
      borderRadius: shape['--gf-shape-radius-circle'],
      boxShadow: shadows['--gf-shadows-z1'],
      transform: {
        default: null,
        [stylex.when.siblingBefore(':checked', legacySwitchInputMarker)]: 'translateX(16px)',
      },
    },
  },
});
