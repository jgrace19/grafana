import clsx from 'clsx';

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { settingsSummaryStyles } from './SettingsSummary.stylex';
import { Trans, t } from '@grafana/i18n';
import { Spinner, TimeRangeLabel, useStyles2 } from '@grafana/ui';

export interface Props {
  timeRange: TimeRange;
  className?: string;
  isDataLoading?: boolean;
  timeSelectionEnabled?: boolean;
  annotationsEnabled?: boolean;
}

export function SettingsSummary({
  className,
  isDataLoading = false,
  timeRange,
  timeSelectionEnabled,
  annotationsEnabled,
}: Props) {

  const translatedTimeRangePickerEnabledStatus = t(
    'public-dashboard.settings-summary.time-range-picker-enabled-text',
    'Time range picker = enabled'
  );
  const translatedTimeRangePickerDisabledStatus = t(
    'public-dashboard.settings-summary.time-range-picker-disabled-text',
    'Time range picker = disabled'
  );
  const translatedAnnotationShownStatus = t(
    'public-dashboard.settings-summary.annotations-show-text',
    'Annotations = show'
  );
  const translatedAnnotationHiddenStatus = t(
    'public-dashboard.settings-summary.annotations-hide-text',
    'Annotations = hide'
  );

  return isDataLoading ? (
    <div {...mergeStylexClassName(stylex.props(settingsSummaryStyles.summaryWrapper, , className), undefined)}>
      <Spinner {...stylex.props(settingsSummaryStyles.summary)} inline={true} size="sm" />
    </div>
  ) : (
    <div {...mergeStylexClassName(stylex.props(settingsSummaryStyles.summaryWrapper, , className), undefined)}>
      <span {...stylex.props(settingsSummaryStyles.summary)}>
        <Trans i18nKey="public-dashboard.settings-summary.time-range-text">Time range = </Trans>
        <TimeRangeLabel {...stylex.props(settingsSummaryStyles.timeRange)} value={timeRange} />
      </span>
      <span {...stylex.props(settingsSummaryStyles.summary)}>
        {timeSelectionEnabled ? translatedTimeRangePickerEnabledStatus : translatedTimeRangePickerDisabledStatus}
      </span>
      <span {...stylex.props(settingsSummaryStyles.summary)}>
        {annotationsEnabled ? translatedAnnotationShownStatus : translatedAnnotationHiddenStatus}
      </span>
    </div>
  );
}

SettingsSummary.displayName = 'SettingsSummary';

;
