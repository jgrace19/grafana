import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { memo, createRef, useState, useEffect, type JSX } from 'react';

import {
  rangeUtil,
  dateTimeFormat,
  timeZoneFormatUserFriendly,
  type TimeOption,
  type TimeRange,
  type TimeZone,
  dateMath,
  getTimeZoneInfo,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';

import { bp, zIndex } from '../../themes/stylex/constants.stylex';
import { components, spacing, typography, v1 } from '../../themes/stylex/tokens.stylex';
import { getFeatureToggle } from '../../utils/featureToggle';
import { ButtonGroup } from '../Button/ButtonGroup';
import { modalStyles } from '../Modal/ModalBase';
import { getPortalContainer } from '../Portal/Portal';
import { ToolbarButton } from '../ToolbarButton/ToolbarButton';
import { Tooltip } from '../Tooltip/Tooltip';

import { TimePickerContent } from './TimeRangePicker/TimePickerContent';
import { TimeZoneDescription } from './TimeZonePicker/TimeZoneDescription';
import { type WeekStart } from './WeekStartPicker';
import { getQuickOptions } from './options';
import { useTimeSync } from './utils/useTimeSync';

/** @public */
export interface TimeRangePickerProps {
  hideText?: boolean;
  value: TimeRange;
  timeZone?: TimeZone;
  fiscalYearStartMonth?: number;

  /**
   * If you handle sync state between pickers yourself use this prop to pass the sync button component.
   * Otherwise, a default one will show automatically if sync is possible.
   */
  timeSyncButton?: JSX.Element;

  // Use to manually set the synced styles for the time range picker if you need to control the sync state yourself.
  isSynced?: boolean;

  // Use to manually set the initial sync state for the time range picker. It will use the current value to sync.
  initialIsSynced?: boolean;

  onChange: (timeRange: TimeRange) => void;
  onChangeTimeZone: (timeZone: TimeZone) => void;
  onChangeFiscalYearStartMonth?: (month: number) => void;
  onMoveBackward: () => void;
  onMoveForward: () => void;
  moveForwardTooltip?: string;
  moveBackwardTooltip?: string;
  onZoom: () => void;
  onError?: (error?: string) => void;
  history?: TimeRange[];
  quickRanges?: TimeOption[];
  hideQuickRanges?: boolean;
  widthOverride?: number;
  isOnCanvas?: boolean;
  onToolbarTimePickerClick?: () => void;
  /** Which day of the week the calendar should start on. Possible values: "saturday", "sunday" or "monday" */
  weekStart?: WeekStart;
}

export interface State {
  isOpen: boolean;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/date-time-pickers-timerangepicker--docs
 */
export function TimeRangePicker(props: TimeRangePickerProps) {
  const [isOpen, setOpen] = useState(false);

  const {
    value,
    onMoveBackward,
    onMoveForward,
    moveForwardTooltip,
    moveBackwardTooltip,
    onZoom,
    onError,
    timeZone,
    fiscalYearStartMonth,
    history,
    onChangeTimeZone,
    onChangeFiscalYearStartMonth,
    quickRanges,
    hideQuickRanges,
    widthOverride,
    isOnCanvas,
    onToolbarTimePickerClick,
    weekStart,
    initialIsSynced,
  } = props;

  const { onChangeWithSync, isSynced, timeSyncButton } = useTimeSync({
    initialIsSynced,
    value,
    onChangeProp: props.onChange,
    isSyncedProp: props.isSynced,
    timeSyncButtonProp: props.timeSyncButton,
  });

  const onChange = (timeRange: TimeRange) => {
    onChangeWithSync(timeRange);
    setOpen(false);
  };

  useEffect(() => {
    if (isOpen && onToolbarTimePickerClick) {
      onToolbarTimePickerClick();
    }
  }, [isOpen, onToolbarTimePickerClick]);

  const onToolbarButtonSwitch = () => {
    setOpen((prevState) => !prevState);
  };

  const onClose = () => {
    setOpen(false);
  };

  const overlayRef = createRef<HTMLElement>();
  const buttonRef = createRef<HTMLElement>();
  const { overlayProps, underlayProps } = useOverlay(
    {
      onClose,
      isDismissable: true,
      isOpen,
      shouldCloseOnInteractOutside: (element) => {
        const portalContainer = getPortalContainer();
        return !buttonRef.current?.contains(element) && !portalContainer.contains(element);
      },
    },
    overlayRef
  );
  const { dialogProps } = useDialog({}, overlayRef);

  const variant = isSynced ? 'active' : isOnCanvas ? 'canvas' : 'default';

  const isFromAfterTo = value?.to?.isBefore(value.from);
  const timePickerIcon = isFromAfterTo ? 'exclamation-triangle' : 'clock-nine';

  const currentTimeRange = formattedRange(value, timeZone, quickRanges);

  return (
    <ButtonGroup className={stylex.props(styles.container).className}>
      <ToolbarButton
        variant={variant}
        onClick={onMoveBackward}
        icon="angle-double-left"
        type="button"
        iconSize="xl"
        data-testid={selectors.components.TimePicker.moveBackwardButton}
        tooltip={
          moveBackwardTooltip ?? t('time-picker.range-picker.backwards-time-aria-label', 'Move time range backwards')
        }
        narrow
      />

      <Tooltip
        ref={buttonRef}
        content={<TimePickerTooltip timeRange={value} timeZone={timeZone} />}
        placement="bottom"
        interactive
      >
        <ToolbarButton
          data-testid={selectors.components.TimePicker.openButton}
          aria-label={t('time-picker.range-picker.current-time-selected', 'Time range selected: {{currentTimeRange}}', {
            currentTimeRange,
          })}
          aria-controls="TimePickerContent"
          onClick={onToolbarButtonSwitch}
          icon={timePickerIcon}
          isOpen={isOpen}
          type="button"
          variant={variant}
        >
          <TimePickerButtonLabel {...props} />
        </ToolbarButton>
      </Tooltip>
      {isOpen && (
        <div data-testid={selectors.components.TimePicker.overlayContent}>
          <div role="presentation" {...stylex.props(modalStyles.modalBackdrop, styles.backdrop)} {...underlayProps} />
          <FocusScope contain autoFocus restoreFocus>
            <section {...stylex.props(styles.content)} ref={overlayRef} {...overlayProps} {...dialogProps}>
              <TimePickerContent
                timeZone={timeZone}
                fiscalYearStartMonth={fiscalYearStartMonth}
                value={value}
                onChange={onChange}
                quickOptions={quickRanges || getQuickOptions()}
                history={history}
                showHistory
                widthOverride={widthOverride}
                onChangeTimeZone={onChangeTimeZone}
                onChangeFiscalYearStartMonth={onChangeFiscalYearStartMonth}
                hideQuickRanges={hideQuickRanges}
                onError={onError}
                weekStart={weekStart}
              />
            </section>
          </FocusScope>
        </div>
      )}

      {timeSyncButton}

      <ToolbarButton
        onClick={onMoveForward}
        icon="angle-double-right"
        type="button"
        variant={variant}
        iconSize="xl"
        data-testid={selectors.components.TimePicker.moveForwardButton}
        tooltip={
          moveForwardTooltip ?? t('time-picker.range-picker.forwards-time-aria-label', 'Move time range forwards')
        }
        narrow
      />

      <Tooltip content={ZoomOutTooltip} placement="bottom">
        <ToolbarButton
          aria-label={t('time-picker.range-picker.zoom-out-button', 'Zoom out time range')}
          onClick={onZoom}
          icon="search-minus"
          type="button"
          data-testid={selectors.components.TimePicker.zoomOut}
          variant={variant}
        />
      </Tooltip>
    </ButtonGroup>
  );
}

TimeRangePicker.displayName = 'TimeRangePicker';

const ZoomOutTooltip = () => {
  const newShortcuts = getFeatureToggle('newTimeRangeZoomShortcuts');
  return (
    <>
      {newShortcuts ? (
        <Trans i18nKey="time-picker.range-picker.zoom-out-tooltip-new">
          Time range zoom out <br /> t -
        </Trans>
      ) : (
        <Trans i18nKey="time-picker.range-picker.zoom-out-tooltip">
          Time range zoom out <br /> CTRL+Z
        </Trans>
      )}
    </>
  );
};

export const TimePickerTooltip = ({ timeRange, timeZone }: { timeRange: TimeRange; timeZone?: TimeZone }) => {
  const now = Date.now();

  // Get timezone info only if timeZone is provided
  const timeZoneInfo = timeZone ? getTimeZoneInfo(timeZone, now) : undefined;

  return (
    <>
      <div className="text-center">
        {dateTimeFormat(timeRange.from, { timeZone })}
        <div className="text-center">
          <Trans i18nKey="time-picker.range-picker.to">to</Trans>
        </div>
        {dateTimeFormat(timeRange.to, { timeZone })}
      </div>
      <div {...stylex.props(labelStyles.container)}>
        <span {...stylex.props(labelStyles.utc)}>{timeZoneFormatUserFriendly(timeZone)}</span>
        <TimeZoneDescription info={timeZoneInfo} />
      </div>
    </>
  );
};

type LabelProps = Pick<TimeRangePickerProps, 'hideText' | 'value' | 'timeZone' | 'quickRanges'>;

export const TimePickerButtonLabel = memo<LabelProps>(({ hideText, value, timeZone, quickRanges }) => {
  if (hideText) {
    return null;
  }

  return (
    <span {...stylex.props(labelStyles.container)} aria-live="polite" aria-atomic="true">
      <span>{formattedRange(value, timeZone, quickRanges)}</span>
      <span {...stylex.props(labelStyles.utc)}>{rangeUtil.describeTimeRangeAbbreviation(value, timeZone)}</span>
    </span>
  );
});

TimePickerButtonLabel.displayName = 'TimePickerButtonLabel';

const formattedRange = (value: TimeRange, timeZone?: TimeZone, quickRanges?: TimeOption[]) => {
  const adjustedTimeRange = {
    to: dateMath.isMathString(value.raw.to) ? value.raw.to : value.to,
    from: dateMath.isMathString(value.raw.from) ? value.raw.from : value.from,
  };
  return rangeUtil.describeTimeRange(adjustedTimeRange, timeZone, quickRanges);
};

const styles = stylex.create({
  container: {
    position: 'relative',
    display: 'flex',
    verticalAlign: 'middle',
  },
  backdrop: {
    display: { default: 'none', [bp.smDown]: 'block' },
  },
  content: {
    position: { default: 'absolute', [bp.smDown]: 'fixed' },
    right: { default: 0, [bp.smDown]: '50%' },
    top: { default: '116%', [bp.smDown]: '50%' },
    zIndex: { default: zIndex.dropdown, [bp.smDown]: zIndex.modal },
    transform: { default: null, [bp.smDown]: 'translate(50%, -50%)' },
  },
});

const labelStyles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    columnGap: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  utc: {
    color: v1['--gf-v1-palette-orange'],
    fontSize: typography['--gf-typography-size-sm'],
    paddingLeft: '6px',
    lineHeight: '28px',
    verticalAlign: 'bottom',
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
});
