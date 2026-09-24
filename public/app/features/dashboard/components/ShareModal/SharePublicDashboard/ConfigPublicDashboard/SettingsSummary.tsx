import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { type TimeRange } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Spinner, TimeRangeLabel } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  timeRange: TimeRange;
  className?: string;
  /** StyleX overrides for the wrapper, applied after its own styles */
  xstyle?: StyleXStyles;
  isDataLoading?: boolean;
  timeSelectionEnabled?: boolean;
  annotationsEnabled?: boolean;
}

export function SettingsSummary({
  className,
  xstyle,
  isDataLoading = false,
  timeRange,
  timeSelectionEnabled,
  annotationsEnabled,
}: Props) {
  const wrapperProps = mergeStylexProps(stylex.props(styles.summaryWrapper, xstyle), { className });
  const summaryProps = stylex.props(styles.summary);

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
    <div {...wrapperProps}>
      <Spinner className={summaryProps.className} inline={true} size="sm" />
    </div>
  ) : (
    <div {...wrapperProps}>
      <span {...summaryProps}>
        <Trans i18nKey="public-dashboard.settings-summary.time-range-text">Time range = </Trans>
        <TimeRangeLabel className={stylex.props(styles.timeRange).className} value={timeRange} />
      </span>
      <span {...summaryProps}>
        {timeSelectionEnabled ? translatedTimeRangePickerEnabledStatus : translatedTimeRangePickerDisabledStatus}
      </span>
      <span {...summaryProps}>
        {annotationsEnabled ? translatedAnnotationShownStatus : translatedAnnotationHiddenStatus}
      </span>
    </div>
  );
}

SettingsSummary.displayName = 'SettingsSummary';

const styles = stylex.create({
  summaryWrapper: {
    display: 'flex',
  },
  summary: {
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
  },
  timeRange: {
    display: 'inline-block',
  },
});
