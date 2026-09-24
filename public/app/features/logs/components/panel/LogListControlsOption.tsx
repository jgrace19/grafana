import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logListControlsOptionStyles } from './LogListControlsOption.stylex';
import React, { type JSX } from 'react';

import { Dropdown, Icon, IconButton, Tooltip } from '@grafana/ui';

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
    const styles = (getStyles, expanded);

    return (
      <div {...mergeStylexClassName(`${logListControlsOptionStyles.container} ${stickToBottom  ? stylex.props(logListControlsOptionStyles.marginTopAuto) : {}, undefined)}`}>
        <label {...stylex.props(logListControlsOptionStyles.label)}>
          <span {...stylex.props(logListControlsOptionStyles.labelText)}>{label ?? tooltip}</span>
          <span {...stylex.props(logListControlsOptionStyles.iconContainer)}>
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
    const styles = (getStyles, expanded);

    return (
      <div {...stylex.props(logListControlsOptionStyles.container)}>
        <label {...stylex.props(logListControlsOptionStyles.label)}>
          <span {...stylex.props(logListControlsOptionStyles.labelText)}>{label ?? tooltip}</span>
          <span>
            <Dropdown overlay={dropdown} placement="auto-end">
              <div {...stylex.props(logListControlsOptionStyles.iconContainer)}>
                <Tooltip content={tooltip}>
                  <button
                    aria-pressed={isActive}
                    aria-label={buttonAriaLabel}
                    className={`${logListControlsOptionStyles.customControlButton} ${isActive ? logListControlsOptionStyles.controlButtonActive : logListControlsOptionStyles.controlButton}`}
                    type="button"
                  >
                    <Icon
                      {...iconButtonProps}
                      ref={ref}
                      name={iconButtonName}
                      size="lg"
                      {...stylex.props(logListControlsOptionStyles.customControlIcon)}
                    />
                    {isActive && <span {...stylex.props(logListControlsOptionStyles.customControlTag)}>{customTagText}</span>}
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
