import * as stylex from '@stylexjs/stylex';
import React, { type JSX } from 'react';

import { Dropdown, Icon, IconButton, Tooltip } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

interface LogControlOptionProps {
  label?: string;
  expanded: boolean;
  tooltip: string;
  stickToBottom?: boolean;
}

export type Props = React.ComponentProps<typeof IconButton> & LogControlOptionProps;

export const LogListControlsOption = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      stickToBottom,
      expanded,
      label,
      tooltip,
      className: iconButtonClassName,
      name: iconButtonName,
      ...iconButtonProps
    }: Props,
    ref
  ) => {
    return (
      <div {...stylex.props(styles.container, stickToBottom && styles.marginTopAuto)}>
        <label {...stylex.props(styles.label, expanded && styles.labelExpanded)}>
          <span {...stylex.props(expanded ? styles.labelText : styles.labelTextHidden)}>{label ?? tooltip}</span>
          <span {...stylex.props(styles.iconContainer)}>
            <IconButton
              name={iconButtonName}
              tooltip={tooltip}
              className={iconButtonClassName}
              ref={ref}
              {...iconButtonProps}
            />
          </span>
        </label>
      </div>
    );
  }
);

interface LogControlSelectOptionProps {
  label?: string;
  expanded: boolean;
  tooltip: string;
  stickToBottom?: boolean;
  dropdown: JSX.Element;
  isActive: boolean;
  customTagText: string;
  buttonAriaLabel: string;
}
export type SelectProps = React.ComponentProps<typeof Icon> & LogControlSelectOptionProps;

export const LogListControlsSelectOption = React.forwardRef<SVGElement, SelectProps>(
  (
    {
      stickToBottom,
      expanded,
      label,
      tooltip,
      className: iconButtonClassName,
      name: iconButtonName,
      dropdown,
      isActive,
      customTagText,
      buttonAriaLabel,
      ...iconButtonProps
    }: SelectProps,
    ref
  ) => {
    return (
      <div {...stylex.props(styles.container)}>
        <label {...stylex.props(styles.label, expanded && styles.labelExpanded)}>
          <span {...stylex.props(expanded ? styles.labelText : styles.labelTextHidden)}>{label ?? tooltip}</span>
          <span>
            <Dropdown overlay={dropdown} placement="auto-end">
              <div {...stylex.props(styles.iconContainer)}>
                <Tooltip content={tooltip}>
                  <button
                    aria-pressed={isActive}
                    aria-label={buttonAriaLabel}
                    {...stylex.props(
                      styles.customControlButton,
                      isActive ? styles.controlButtonActive : styles.controlButton
                    )}
                    type="button"
                  >
                    <Icon
                      {...iconButtonProps}
                      ref={ref}
                      name={iconButtonName}
                      size="lg"
                      xstyle={styles.customControlIcon}
                    />
                    {isActive && <span {...stylex.props(styles.customControlTag)}>{customTagText}</span>}
                  </button>
                </Tooltip>
              </div>
            </Dropdown>
          </span>
        </label>
      </div>
    );
  }
);

LogListControlsSelectOption.displayName = 'LogListControlsSelectOption';
LogListControlsOption.displayName = 'LogListControlsOption';

const hoverSize = '26px';

const styles = stylex.create({
  customControlTag: {
    color: colors['--gf-colors-primary-text'],
    fontSize: 10,
    position: 'absolute',
    bottom: -4,
    right: 1,
    lineHeight: '10px',
    backgroundColor: colors['--gf-colors-background-primary'],
    paddingLeft: 2,
  },
  customControlIcon: {
    verticalAlign: 'baseline',
  },
  customControlButton: {
    position: 'relative',
    zIndex: 0,
    margin: 0,
    boxShadow: 'none',
    borderStyle: 'none',
    display: 'flex',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    overflow: 'visible',
    width: '100%',
  },
  controlButtonActive: {
    margin: 0,
    color: colors['--gf-colors-text-secondary'],
    height: spacing['--gf-spacing-x2'],
    '::before': {
      zIndex: -1,
      position: 'absolute',
      opacity: { default: 0, ':hover': 1 },
      backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
      width: hoverSize,
      height: hoverSize,
      borderRadius: shape['--gf-shape-radius-default'],
      content: '""',
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.2s' },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    },
    '::after': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      height: 2,
      borderRadius: shape['--gf-shape-radius-default'],
      bottom: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
      backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
      width: `calc(${spacing['--gf-spacing-grid-size']} * 2.25)`,
      opacity: 1,
    },
  },
  controlButton: {
    margin: 0,
    color: colors['--gf-colors-text-secondary'],
    height: spacing['--gf-spacing-x2'],
  },
  marginTopAuto: {
    marginTop: 'auto',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  labelText: {
    display: 'block',
  },
  labelTextHidden: {
    display: 'none',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '16px',
  },
  container: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    height: spacing['--gf-spacing-x2'],
    width: 'auto',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: 0,
  },
  labelExpanded: {
    justifyContent: 'space-between',
    marginRight: '2.5px',
  },
});
