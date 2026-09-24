import { autoUpdate, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { type FormEvent, useCallback, useRef, useState } from 'react';

import { type RelativeTimeRange, type GrafanaTheme2, type TimeOption } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';

import { useTheme2 } from '../../../themes/ThemeContext';
import { motion, zIndex } from '../../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing, typography } from '../../../themes/stylex/tokens.stylex';
import { getPositioningMiddleware } from '../../../utils/floating';
import { Button } from '../../Button/Button';
import { Field } from '../../Forms/Field';
import { Icon } from '../../Icon/Icon';
import { Input } from '../../Input/Input';
import { ScrollContainer } from '../../ScrollContainer/ScrollContainer';
import { TimePickerTitle } from '../TimeRangePicker/TimePickerTitle';
import { TimeRangeList } from '../TimeRangePicker/TimeRangeList';
import { getQuickOptions } from '../options';

import {
  isRangeValid,
  isRelativeFormat,
  mapOptionToRelativeTimeRange,
  mapRelativeTimeRangeToOption,
  type RangeValidation,
} from './utils';

/**
 * @internal
 */
export interface RelativeTimeRangePickerProps {
  timeRange: RelativeTimeRange;
  onChange: (timeRange: RelativeTimeRange) => void;
}

type InputState = {
  value: string;
  validation: RangeValidation;
};

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/date-time-pickers-relativetimerangepicker--docs
 * @internal
 */
export function RelativeTimeRangePicker(props: RelativeTimeRangePickerProps) {
  const { timeRange, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);
  const timeOption = mapRelativeTimeRangeToOption(timeRange);
  const [from, setFrom] = useState<InputState>({ value: timeOption.from, validation: isRangeValid(timeOption.from) });
  const [to, setTo] = useState<InputState>({ value: timeOption.to, validation: isRangeValid(timeOption.to) });
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(
    { onClose: () => setIsOpen(false), isDismissable: true, isOpen },
    ref
  );
  const { dialogProps } = useDialog({}, ref);
  const validOptions = getQuickOptions().filter((o) => isRelativeFormat(o.from));
  const placement = 'bottom-start';

  // the order of middleware is important!
  // see https://floating-ui.com/docs/arrow#order
  const middleware = getPositioningMiddleware(placement);

  const { context, refs, floatingStyles } = useFloating({
    open: isOpen,
    placement,
    onOpenChange: setIsOpen,
    middleware,
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

  const theme = useTheme2();
  const bodyHeight =
    bodyMinimumHeight +
    calculateErrorHeight(theme, from.validation.errorMessage) +
    calculateErrorHeight(theme, to.validation.errorMessage);

  const onChangeTimeOption = (option: TimeOption) => {
    const relativeTimeRange = mapOptionToRelativeTimeRange(option);
    if (!relativeTimeRange) {
      return;
    }
    onClose();
    setFrom({ ...from, value: option.from });
    setTo({ ...to, value: option.to });
    onChange(relativeTimeRange);
  };

  const onOpen = useCallback(
    (event: FormEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  const onApply = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!to.validation.isValid || !from.validation.isValid) {
      return;
    }

    const timeRange = mapOptionToRelativeTimeRange({
      from: from.value,
      to: to.value,
      display: '',
    });

    if (!timeRange) {
      return;
    }

    onChange(timeRange);
    setIsOpen(false);
  };

  const { from: timeOptionFrom, to: timeOptionTo } = timeOption;

  return (
    <div {...stylex.props(styles.container)}>
      <button
        ref={refs.setReference}
        {...stylex.props(styles.pickerInput)}
        type="button"
        onClick={onOpen}
        {...getReferenceProps()}
      >
        <span {...stylex.props(styles.clockIcon)}>
          <Icon name="clock-nine" />
        </span>
        <span>
          <Trans i18nKey="time-picker.time-range.from-to">
            {{ timeOptionFrom }} to {{ timeOptionTo }}
          </Trans>
        </span>
        <span {...stylex.props(styles.caretIcon)}>
          <Icon name={isOpen ? 'angle-up' : 'angle-down'} size="lg" />
        </span>
      </button>
      {isOpen && (
        <div>
          <div role="presentation" {...stylex.props(styles.backdrop)} {...underlayProps} />
          <FocusScope contain autoFocus restoreFocus>
            <div ref={ref} {...overlayProps} {...dialogProps}>
              <div
                {...mergeStylexProps(stylex.props(styles.content), { style: floatingStyles })}
                ref={refs.setFloating}
                {...getFloatingProps()}
              >
                <div {...stylex.props(styles.body, styles.height(`${bodyHeight}px`))}>
                  <div {...stylex.props(styles.leftSide)}>
                    <ScrollContainer showScrollIndicators>
                      <TimeRangeList
                        title={t('time-picker.time-range.example-title', 'Example time ranges')}
                        options={validOptions}
                        onChange={onChangeTimeOption}
                        value={timeOption}
                      />
                    </ScrollContainer>
                  </div>
                  <div {...stylex.props(styles.rightSide)}>
                    <div {...stylex.props(styles.title)}>
                      <TimePickerTitle>
                        <Trans i18nKey="time-picker.time-range.specify">Specify time range</Trans>
                      </TimePickerTitle>
                    </div>
                    <Field
                      label={t('time-picker.time-range.from-label', 'From')}
                      invalid={!from.validation.isValid}
                      error={from.validation.errorMessage}
                    >
                      <Input
                        onClick={(event) => event.stopPropagation()}
                        onBlur={() => setFrom({ ...from, validation: isRangeValid(from.value) })}
                        onChange={(event) => setFrom({ ...from, value: event.currentTarget.value })}
                        value={from.value}
                      />
                    </Field>
                    <Field
                      label={t('time-picker.time-range.to-label', 'To')}
                      invalid={!to.validation.isValid}
                      error={to.validation.errorMessage}
                    >
                      <Input
                        onClick={(event) => event.stopPropagation()}
                        onBlur={() => setTo({ ...to, validation: isRangeValid(to.value) })}
                        onChange={(event) => setTo({ ...to, value: event.currentTarget.value })}
                        value={to.value}
                      />
                    </Field>
                    <Button
                      aria-label={t('time-picker.time-range.submit-button-label', 'TimePicker submit button')}
                      onClick={onApply}
                    >
                      <Trans i18nKey="time-picker.time-range.apply">Apply time range</Trans>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </FocusScope>
        </div>
      )}
    </div>
  );
}

const bodyMinimumHeight = 250;

function calculateErrorHeight(theme: GrafanaTheme2, errorMessage?: string): number {
  if (!errorMessage) {
    return 0;
  }

  if (errorMessage.length > 34) {
    return theme.spacing.gridSize * 6.5;
  }

  return theme.spacing.gridSize * 4;
}

// The Input look (getInputStyles `input` + `wrapper`, `prefix`, `suffix`) as Emotion's merged classes resolved it.
const styles = stylex.create({
  backdrop: {
    position: 'fixed',
    zIndex: zIndex.modalBackdrop,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  container: {
    display: 'flex',
    position: 'relative',
  },
  pickerInput: {
    padding: 0,
    backgroundColor: components['--gf-components-input-background'],
    lineHeight: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']} - 2px)`,
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
  caretIcon: {
    position: 'relative',
    top: 0,
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
  clockIcon: {
    position: 'relative',
    top: 0,
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
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    borderRightStyle: 'none',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  content: {
    backgroundColor: colors['--gf-colors-background-primary'],
    boxShadow: shadows['--gf-shadows-z3'],
    position: 'absolute',
    zIndex: zIndex.modal,
    width: '500px',
    top: '100%',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    left: 0,
    whiteSpace: 'normal',
  },
  body: {
    display: 'flex',
  },
  height: (height: string) => ({ height }),
  leftSide: {
    width: '50%',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-medium'],
  },
  rightSide: {
    width: '50%',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  title: {
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
});
