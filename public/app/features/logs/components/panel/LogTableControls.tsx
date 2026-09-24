import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logTableControlsStyles } from './LogTableControls.stylex';
import { useCallback, useMemo } from 'react';

import { t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { Dropdown, Menu } from '@grafana/ui';

import { DownloadFormat } from '../../utils';

import { CONTROLS_WIDTH_EXPANDED } from './LogListControls';
import { LogListControlsOption } from './LogListControlsOption';
import { LOG_LIST_CONTROLS_WIDTH } from './virtualization';

type Props = {
  controlsExpanded: boolean;
  setControlsExpanded: (expanded: boolean) => void;
  setSortOrder: (sortOrder: LogsSortOrder) => void;
  logOptionsStorageKey: string;
  sortOrder: LogsSortOrder;
  downloadLogs: (format: DownloadFormat) => void;
  onWrapTextClick: () => void;
  wrapText: boolean;
};

export const LogTableControls = ({
  controlsExpanded,
  logOptionsStorageKey,
  setControlsExpanded,
  setSortOrder,
  sortOrder,
  downloadLogs,
  onWrapTextClick,
  wrapText,
}: Props) => {
  const styles = (getStyles, controlsExpanded);

  const onExpandControlsClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_expand_controls_clicked');
    setControlsExpanded(!controlsExpanded);
    store.set(`${logOptionsStorageKey}.controlsExpanded`, !controlsExpanded);
  }, [controlsExpanded, logOptionsStorageKey, setControlsExpanded]);

  const onSortOrderClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_sort_order_clicked', {
      order: sortOrder === LogsSortOrder.Ascending ? LogsSortOrder.Descending : LogsSortOrder.Ascending,
    });
    setSortOrder(sortOrder === LogsSortOrder.Ascending ? LogsSortOrder.Descending : LogsSortOrder.Ascending);
  }, [setSortOrder, sortOrder]);

  const downloadMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          label={t('logs.logs-controls.download-logs.txt', 'txt')}
          onClick={() => {
            downloadLogs(DownloadFormat.Text);
            reportInteraction('logs_log_list_controls_downloaded_logs', {
              format: DownloadFormat.Text,
            });
          }}
        />
        <Menu.Item
          label={t('logs.logs-controls.download-logs.json', 'json')}
          onClick={() => {
            downloadLogs(DownloadFormat.Json);
            reportInteraction('logs_log_list_controls_downloaded_logs', {
              format: DownloadFormat.Json,
            });
          }}
        />
        <Menu.Item
          label={t('logs.logs-controls.download-logs.csv', 'csv')}
          onClick={() => {
            downloadLogs(DownloadFormat.CSV);
            reportInteraction('logs_log_list_controls_downloaded_logs', {
              format: DownloadFormat.CSV,
            });
          }}
        />
      </Menu>
    ),
    [downloadLogs]
  );

  return (
    <div {...stylex.props(logTableControlsStyles.navContainer)}>
      <LogListControlsOption
        expanded={controlsExpanded}
        name="arrow-from-right"
        {...mergeStylexClassName(stylex.props(logTableControlsStyles.controlsExpandedButton, logTableControlsStyles.controlButton, ), undefined)}
        variant="secondary"
        onClick={onExpandControlsClick}
        label={
          controlsExpanded
            ? t('logs.logs-controls.label.collapse', 'Expanded')
            : t('logs.logs-controls.label.expand', 'Collapsed')
        }
        tooltip={
          controlsExpanded ? t('logs.logs-controls.collapse', 'Collapse') : t('logs.logs-controls.expand', 'Expand')
        }
        size="lg"
      />

      <LogListControlsOption
        expanded={controlsExpanded}
        name={sortOrder === LogsSortOrder.Descending ? 'sort-amount-up' : 'sort-amount-down'}
        {...stylex.props(logTableControlsStyles.controlButton)}
        onClick={onSortOrderClick}
        label={
          sortOrder === LogsSortOrder.Descending
            ? t('logs.logs-controls.labels.newest-first', 'Newest logs first')
            : t('logs.logs-controls.labels.oldest-first', 'Oldest logs first')
        }
        tooltip={
          sortOrder === LogsSortOrder.Descending
            ? t('logs.logs-controls.newest-first', 'Sorted by newest logs first - Click to show oldest first')
            : t('logs.logs-controls.oldest-first', 'Sorted by oldest logs first - Click to show newest first')
        }
        size="lg"
      />

      <LogListControlsOption
        expanded={controlsExpanded}
        name="wrap-text"
        className={wrapText ? logTableControlsStyles.controlButtonActive : logTableControlsStyles.controlButton}
        aria-pressed={wrapText}
        onClick={onWrapTextClick}
        tooltip={
          wrapText
            ? t('logs.logs-controls.table-wrap-text.disable', 'Disable text wrapping')
            : t('logs.logs-controls.table-wrap-text.enable', 'Enable text wrapping')
        }
        label={
          wrapText
            ? t('logs.logs-controls.table-wrap-text.enabled', 'Wrapping enabled')
            : t('logs.logs-controls.table-wrap-text.disabled', 'Wrapping disabled')
        }
      />

      {!config.exploreHideLogsDownload && (
        <>
          <div {...stylex.props(logTableControlsStyles.divider)} />
          <Dropdown overlay={downloadMenu} placement="auto-end">
            <LogListControlsOption
              expanded={controlsExpanded}
              name="download-alt"
              {...stylex.props(logTableControlsStyles.controlButton)}
              label={t('logs.logs-controls.download', 'Download logs')}
              tooltip={t('logs.logs-controls.tooltip.download', 'Download')}
              size="lg"
            />
          </Dropdown>
        </>
      )}
    </div>
  );
};

;
