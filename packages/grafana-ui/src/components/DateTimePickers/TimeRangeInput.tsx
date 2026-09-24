import { useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { FocusScope } from '@react-aria/focus';
import * as stylex from '@stylexjs/stylex';
import { type FormEvent, type MouseEvent, useState } from 'react';

import { dateTime, getDefaultTimeRange, type TimeRange, type TimeZone } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { motion, zIndex } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';

import { TimePickerContent } from './TimeRangePicker/TimePickerContent';
import { TimeRangeLabel } from './TimeRangePicker/TimeRangeLabel';
import { type WeekStart } from './WeekStartPicker';
import { getQuickOptions } from './options';
import { isValidTimeRange } from './utils';

export interface TimeRangeInputProps {
  value: TimeRange;
  timeZone?: TimeZone;
  onChange: (timeRange: TimeRange) => void;
  onChangeTimeZone?: (timeZone: TimeZone) => void;
  hideTimeZone?: boolean;
  placeholder?: string;
  clearable?: boolean;
  /** Controls horizontal alignment of the picker menu */
  isReversed?: boolean;
  /** Controls visibility of the preset time ranges (e.g. **Last 5 minutes**) in the picker menu */
  hideQuickRanges?: boolean;
  disabled?: boolean;
  showIcon?: boolean;
  /** Which day of the week the calendar should start on. Possible values: "saturday", "sunday" or "monday" */
  weekStart?: WeekStart;
}

const noop = () => {};

/**
 * A variant of TimeRangePicker for use in forms.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/date-time-pickers-timerangeinput--docs
 */
export const TimeRangeInput = ({
  value,
  onChange,
  onChangeTimeZone = noop,
  clearable,
  weekStart,
  hideTimeZone = true,
  timeZone = 'browser',
  placeholder = 'Select time range',
  isReversed = true,
  hideQuickRanges = false,
  disabled = false,
  showIcon = false,
}: TimeRangeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = (event: FormEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onRangeChange = (timeRange: TimeRange) => {
    onClose();
    onChange(timeRange);
  };

  const onRangeClear = (event: MouseEvent<SVGElement>) => {
    event.stopPropagation();
    const from = dateTime(null);
    const to = dateTime(null);
    onChange({ from, to, raw: { from, to } });
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  const dismiss = useDismiss(context, {
    bubbles: {
      outsidePress: false,
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  return (
    <div {...stylex.props(styles.container)}>
      <button
        type="button"
        {...stylex.props(styles.pickerInput, disabled && styles.inputDisabled)}
        data-testid={selectors.components.TimePicker.openButton}
        onClick={onOpen}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {showIcon && <Icon name="clock-nine" size={'sm'} xstyle={styles.icon} />}

        <TimeRangeLabel value={value} timeZone={timeZone} placeholder={placeholder} />

        {!disabled && (
          <span {...stylex.props(styles.caretIcon)}>
            {isValidTimeRange(value) && clearable && (
              <Icon xstyle={styles.clearIcon} name="times" size="lg" onClick={onRangeClear} />
            )}
            <Icon name={isOpen ? 'angle-up' : 'angle-down'} size="lg" />
          </span>
        )}
      </button>
      {isOpen && (
        <FocusScope contain autoFocus restoreFocus>
          <section
            {...mergeStylexProps(stylex.props(styles.content), { style: floatingStyles })}
            ref={refs.setFloating}
            {...getFloatingProps()}
          >
            <TimePickerContent
              timeZone={timeZone}
              value={isValidTimeRange(value) ? value : getDefaultTimeRange()}
              onChange={onRangeChange}
              quickOptions={getQuickOptions()}
              onChangeTimeZone={onChangeTimeZone}
              className={stylex.props(styles.content).className}
              hideTimeZone={hideTimeZone}
              isReversed={isReversed}
              hideQuickRanges={hideQuickRanges}
              weekStart={weekStart}
            />
          </section>
        </FocusScope>
      )}
    </div>
  );
};

// The Input look (getInputStyles `input` + `wrapper`) as Emotion's merged class resolved it on a <button>.
const styles = stylex.create({
  container: {
    display: 'flex',
    position: 'relative',
  },
  content: {
    marginLeft: 0,
    position: 'absolute',
    top: '116%',
    zIndex: zIndex.modal,
  },
  pickerInput: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    backgroundColor: components['--gf-components-input-background'],
    lineHeight: `calc(${spacing['--gf-spacing-grid-size']} * 4 - 2px)`,
    fontSize: typography['--gf-typography-size-md'],
    color: components['--gf-components-input-text'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': components['--gf-components-input-border-hover'],
    },
    position: 'relative',
    zIndex: 0,
    flexGrow: 1,
    borderRadius: shape['--gf-shape-radius-default'],
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    // Input's later `:focus { outline: none }` replaced the ring's transparent outline.
    outlineStyle: { default: null, ':focus': 'none' },
    outlineOffset: { default: null, ':focus': '2px' },
    boxShadow: {
      default: null,
      ':focus': `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
    },
    transitionProperty: { default: null, ':focus': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
  },
  // Disabled keeps the hover border colour, like the Emotion rule it replaces.
  inputDisabled: {
    backgroundColor: colors['--gf-colors-action-disabled-background'],
    color: colors['--gf-colors-action-disabled-text'],
    borderColor: {
      default: colors['--gf-colors-action-disabled-background'],
      ':hover': components['--gf-components-input-border-hover'],
    },
    boxShadow: { default: null, ':focus': 'none' },
  },
  caretIcon: {
    position: 'relative',
    top: '-1px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: typography['--gf-typography-size-md'],
    height: '100%',
    minWidth: '28px',
    color: colors['--gf-colors-text-secondary'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    borderLeftStyle: 'none',
    borderTopLeftRadius: 'unset',
    borderBottomLeftRadius: 'unset',
    right: 0,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  clearIcon: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    color: { default: null, ':hover': colors['--gf-colors-text-max-contrast'] },
  },
  icon: {
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
});
