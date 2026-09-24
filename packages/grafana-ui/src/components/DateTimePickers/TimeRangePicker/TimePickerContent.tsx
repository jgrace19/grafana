import * as stylex from '@stylexjs/stylex';
import { memo, useMemo, useState } from 'react';

import {
  isDateTime,
  isValidGrafanaDuration,
  rangeUtil,
  type RawTimeRange,
  type TimeOption,
  type TimeRange,
  type TimeZone,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';

import { useTheme2 } from '../../../themes/ThemeContext';
import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { mixins } from '../../../themes/stylex/mixins';
import { colors, shadows, shape, spacing } from '../../../themes/stylex/tokens.stylex';
import { FilterInput } from '../../FilterInput/FilterInput';
import { Icon } from '../../Icon/Icon';
import { TextLink } from '../../Link/TextLink';
import { type WeekStart } from '../WeekStartPicker';

import { TimePickerFooter } from './TimePickerFooter';
import { TimePickerTitle } from './TimePickerTitle';
import { TimeRangeContent } from './TimeRangeContent';
import { TimeRangeList } from './TimeRangeList';
import { mapOptionToTimeRange, mapRangeToTimeOption } from './mapper';

interface Props {
  value: TimeRange;
  onChange: (timeRange: TimeRange) => void;
  onChangeTimeZone: (timeZone: TimeZone) => void;
  onChangeFiscalYearStartMonth?: (month: number) => void;
  onError?: (error?: string) => void;
  timeZone?: TimeZone;
  fiscalYearStartMonth?: number;
  quickOptions?: TimeOption[];
  history?: TimeRange[];
  showHistory?: boolean;
  className?: string;
  hideTimeZone?: boolean;
  /** Reverse the order of relative and absolute range pickers. Used to left align the picker in forms */
  isReversed?: boolean;
  hideQuickRanges?: boolean;
  widthOverride?: number;
  weekStart?: WeekStart;
}

export interface PropsWithScreenSize extends Props {
  isFullscreen: boolean;
}

interface FormProps extends Omit<Props, 'history'> {
  historyOptions?: TimeOption[];
}

export const TimePickerContentWithScreenSize = (props: PropsWithScreenSize) => {
  const {
    quickOptions = [],
    isReversed,
    isFullscreen,
    hideQuickRanges,
    timeZone,
    fiscalYearStartMonth,
    value,
    onChange,
    history,
    showHistory,
    className,
    hideTimeZone,
    onChangeTimeZone,
    onChangeFiscalYearStartMonth,
  } = props;
  const isHistoryEmpty = !history?.length;
  const isContainerTall =
    (isFullscreen && showHistory) || (!isFullscreen && ((showHistory && !isHistoryEmpty) || !hideQuickRanges));
  const historyOptions = mapToHistoryOptions(history, timeZone);
  const baseTimeOption = useTimeOption(value.raw, quickOptions);
  const [searchTerm, setSearchQuery] = useState('');

  const { filteredQuickOptions, customTimeOption } = useMemo(() => {
    const filtered = quickOptions.filter((o) => o.display.toLowerCase().includes(searchTerm.toLowerCase()));
    const customTimeOption = isValidGrafanaDuration(searchTerm) && rangeUtil.describeTextRange(searchTerm);

    if (customTimeOption) {
      const alreadyExists = filtered.some((o) => o.from === customTimeOption.from && o.to === customTimeOption.to);

      if (!alreadyExists) {
        return { filteredQuickOptions: [customTimeOption, ...filtered], customTimeOption };
      }
    }

    return { filteredQuickOptions: filtered, customTimeOption: undefined };
  }, [searchTerm, quickOptions]);

  const timeOption = customTimeOption || baseTimeOption;

  const onChangeTimeOption = (timeOption: TimeOption) => {
    return onChange(mapOptionToTimeRange(timeOption));
  };

  return (
    <div
      id="TimePickerContent"
      {...mergeStylexProps(
        stylex.props(
          styles.container,
          isFullscreen ? styles.containerFullscreen : styles.containerNarrow,
          isReversed ? styles.containerReversed : styles.containerDefault
        ),
        { className }
      )}
    >
      <div {...stylex.props(styles.body, isContainerTall ? styles.bodyTall : styles.bodyShort)}>
        {(!isFullscreen || !hideQuickRanges) && (
          <div
            {...stylex.props(
              styles.rightSide,
              isFullscreen ? styles.rightSideFullscreen : styles.rightSideNarrow,
              isReversed && styles.rightSideReversed
            )}
          >
            <div {...stylex.props(styles.timeRangeFilter)}>
              <FilterInput
                width={0}
                value={searchTerm}
                onChange={setSearchQuery}
                escapeRegex={false}
                placeholder={t('time-picker.content.filter-placeholder', 'Search quick ranges')}
              />
            </div>
            <div {...stylex.props(styles.scrollContent)}>
              {!isFullscreen && <NarrowScreenForm {...props} historyOptions={historyOptions} />}
              {!hideQuickRanges && (
                <TimeRangeList options={filteredQuickOptions} onChange={onChangeTimeOption} value={timeOption} />
              )}
            </div>
          </div>
        )}
        {isFullscreen && (
          <div
            {...stylex.props(
              styles.leftSide,
              isReversed ? styles.leftSideReversed : styles.leftSideDefault,
              hideQuickRanges ? styles.leftSideFull : styles.leftSidePartial
            )}
          >
            <FullScreenForm {...props} historyOptions={historyOptions} />
          </div>
        )}
      </div>
      {!hideTimeZone && isFullscreen && (
        <TimePickerFooter
          timeZone={timeZone}
          fiscalYearStartMonth={fiscalYearStartMonth}
          onChangeTimeZone={onChangeTimeZone}
          onChangeFiscalYearStartMonth={onChangeFiscalYearStartMonth}
        />
      )}
    </div>
  );
};

export const TimePickerContent = (props: Props) => {
  const { widthOverride } = props;
  const theme = useTheme2();
  const isFullscreen = (widthOverride || window.innerWidth) >= theme.breakpoints.values.lg;
  return <TimePickerContentWithScreenSize {...props} isFullscreen={isFullscreen} />;
};

const NarrowScreenForm = (props: FormProps) => {
  const { value, hideQuickRanges, onChange, timeZone, historyOptions = [], showHistory, onError, weekStart } = props;
  const isAbsolute = isDateTime(value.raw.from) || isDateTime(value.raw.to);
  const [collapsedFlag, setCollapsedFlag] = useState(!isAbsolute);
  const collapsed = hideQuickRanges ? false : collapsedFlag;

  const onChangeTimeOption = (timeOption: TimeOption) => {
    return onChange(mapOptionToTimeRange(timeOption, timeZone));
  };

  return (
    <fieldset>
      <div {...stylex.props(narrowScreenStyles.header)}>
        <button
          type={'button'}
          {...stylex.props(mixins.focusRing, narrowScreenStyles.expandButton)}
          onClick={() => {
            if (!hideQuickRanges) {
              setCollapsedFlag(!collapsed);
            }
          }}
          data-testid={selectors.components.TimePicker.absoluteTimeRangeTitle}
          aria-expanded={!collapsed}
          aria-controls="expanded-timerange"
        >
          <TimePickerTitle>
            <Trans i18nKey="time-picker.absolute.title">Absolute time range</Trans>
          </TimePickerTitle>
          {!hideQuickRanges && <Icon name={!collapsed ? 'angle-up' : 'angle-down'} />}
        </button>
      </div>
      {!collapsed && (
        <div {...stylex.props(narrowScreenStyles.body)} id="expanded-timerange">
          <div {...stylex.props(narrowScreenStyles.form)}>
            <TimeRangeContent
              value={value}
              onApply={onChange}
              timeZone={timeZone}
              isFullscreen={false}
              onError={onError}
              weekStart={weekStart}
            />
          </div>
          {showHistory && (
            <TimeRangeList
              title={t('time-picker.absolute.recent-title', 'Recently used absolute ranges')}
              options={historyOptions}
              onChange={onChangeTimeOption}
              placeholderEmpty={null}
            />
          )}
        </div>
      )}
    </fieldset>
  );
};

const FullScreenForm = (props: FormProps) => {
  const { onChange, value, timeZone, fiscalYearStartMonth, isReversed, historyOptions, onError, weekStart } = props;
  const onChangeTimeOption = (timeOption: TimeOption) => {
    return onChange(mapOptionToTimeRange(timeOption, timeZone));
  };

  return (
    <>
      <div
        {...stylex.props(
          fullScreenStyles.container,
          !props.hideQuickRanges && fullScreenStyles.containerWithQuickRanges
        )}
      >
        <div
          {...stylex.props(fullScreenStyles.title)}
          data-testid={selectors.components.TimePicker.absoluteTimeRangeTitle}
        >
          <TimePickerTitle>
            <Trans i18nKey="time-picker.absolute.title">Absolute time range</Trans>
          </TimePickerTitle>
        </div>
        <TimeRangeContent
          value={value}
          timeZone={timeZone}
          fiscalYearStartMonth={fiscalYearStartMonth}
          onApply={onChange}
          isFullscreen={true}
          isReversed={isReversed}
          onError={onError}
          weekStart={weekStart}
        />
      </div>
      {props.showHistory && (
        <div {...stylex.props(fullScreenStyles.recent)}>
          <TimeRangeList
            title={t('time-picker.absolute.recent-title', 'Recently used absolute ranges')}
            options={historyOptions || []}
            onChange={onChangeTimeOption}
            placeholderEmpty={<EmptyRecentList />}
          />
        </div>
      )}
    </>
  );
};

const EmptyRecentList = memo(() => {
  const emptyRecentListText = t(
    'time-picker.content.empty-recent-list-info',
    "It looks like you haven't used this time picker before. As soon as you enter some time intervals, recently used intervals will appear here."
  );

  return (
    <div {...stylex.props(emptyListStyles.container)}>
      <div>
        <span {...stylex.props(emptyListStyles.text)}>{emptyRecentListText}</span>
      </div>
      <Trans i18nKey="time-picker.content.empty-recent-list-docs">
        <div>
          <TextLink
            href="https://grafana.com/docs/grafana/latest/dashboards/time-range-controls"
            external
            xstyle={emptyListStyles.text}
          >
            Read the documentation
          </TextLink>
          <span {...stylex.props(emptyListStyles.text)}> to find out more about how to enter custom time ranges.</span>
        </div>
      </Trans>
    </div>
  );
});

function mapToHistoryOptions(ranges?: TimeRange[], timeZone?: TimeZone): TimeOption[] {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return [];
  }

  return ranges.map((range) => mapRangeToTimeOption(range, timeZone));
}

EmptyRecentList.displayName = 'EmptyRecentList';

const useTimeOption = (raw: RawTimeRange, quickOptions: TimeOption[]): TimeOption | undefined => {
  return useMemo(() => {
    if (!rangeUtil.isRelativeTimeRange(raw)) {
      return;
    }
    return quickOptions.find((option) => {
      return option.from === raw.from && option.to === raw.to;
    });
  }, [raw, quickOptions]);
};

const styles = stylex.create({
  container: {
    backgroundColor: colors['--gf-colors-background-elevated'],
    boxShadow: shadows['--gf-shadows-z3'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    flexDirection: 'column',
  },
  containerFullscreen: {
    width: '546px',
  },
  containerNarrow: {
    width: '262px',
  },
  containerDefault: {
    right: 0,
  },
  containerReversed: {
    left: 0,
  },
  body: {
    display: 'flex',
    flexDirection: 'row-reverse',
    maxHeight: '100vh',
  },
  bodyTall: {
    height: '381px',
  },
  bodyShort: {
    height: '217px',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    scrollbarWidth: 'thin',
  },
  leftSideDefault: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    order: 0,
  },
  leftSideReversed: {
    borderRightStyle: 'none',
    order: 1,
  },
  leftSidePartial: {
    width: '60%',
  },
  leftSideFull: {
    width: '100%',
  },
  rightSide: {
    borderRightStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  rightSideFullscreen: {
    width: '40%',
  },
  rightSideNarrow: {
    width: '100%',
  },
  rightSideReversed: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
  },
  timeRangeFilter: {
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  scrollContent: {
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },
});

const narrowScreenStyles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    paddingTop: '7px',
    paddingRight: '9px',
    paddingBottom: '7px',
    paddingLeft: '9px',
  },
  expandButton: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    display: 'flex',
    width: '100%',
  },
  body: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  form: {
    paddingTop: '7px',
    paddingRight: '9px',
    paddingBottom: '7px',
    paddingLeft: '9px',
  },
});

const fullScreenStyles = stylex.create({
  container: {
    paddingTop: '9px',
    paddingLeft: '11px',
    paddingRight: '11px',
  },
  containerWithQuickRanges: {
    paddingRight: '20%',
  },
  title: {
    marginBottom: '11px',
  },
  recent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
});

const emptyListStyles = stylex.create({
  container: {
    padding: '12px',
    margin: '12px',
  },
  text: {
    fontSize: '13px',
  },
});
