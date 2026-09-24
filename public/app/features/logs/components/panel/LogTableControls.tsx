import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo } from 'react';

import { LogsSortOrder, store } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { Dropdown, Menu } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { DownloadFormat } from '../../utils';

import { CONTROLS_WIDTH_EXPANDED, controlButtonStyle, getControlButtonProps } from './LogListControls';
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
    <div
      {...stylex.props(
        styles.navContainer,
        styles.navContainerWidth(controlsExpanded ? CONTROLS_WIDTH_EXPANDED : LOG_LIST_CONTROLS_WIDTH)
      )}
    >
      <LogListControlsOption
        expanded={controlsExpanded}
        name="arrow-from-right"
        className={stylex.props(styles.controlButton, !controlsExpanded && styles.controlsCollapsedButton).className}
        style={controlButtonStyle}
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
        {...getControlButtonProps(false)}
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
        {...getControlButtonProps(wrapText)}
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
          <div {...stylex.props(styles.divider)} />
          <Dropdown overlay={downloadMenu} placement="auto-end">
            <LogListControlsOption
              expanded={controlsExpanded}
              name="download-alt"
              {...getControlButtonProps(false)}
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

const styles = stylex.create({
  navContainer: {
    height: '100%',
    display: 'flex',
    flexGrow: '1',
    flexShrink: '0',
    flexBasis: 'auto',
    gap: spacing['--gf-spacing-x3'],
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: spacing['--gf-spacing-x1'],
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    borderLeftColor: colors['--gf-colors-border-medium'],
    minWidth: spacing['--gf-spacing-x4'],
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  navContainerWidth: (width: number) => ({
    width,
  }),
  controlsCollapsedButton: {
    transform: 'rotate(180deg)',
  },
  controlButton: {
    height: spacing['--gf-spacing-x2'],
  },
  divider: {
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderTopColor: colors['--gf-colors-border-medium'],
    height: 1,
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * -0.25)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * -1.75)`,
  },
});
