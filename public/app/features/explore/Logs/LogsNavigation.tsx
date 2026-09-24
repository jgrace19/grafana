import { useBooleanFlagValue } from '@openfeature/react-sdk';
import * as stylex from '@stylexjs/stylex';
import { memo, useCallback } from 'react';

import { LogsSortOrder } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, Icon } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { getChromeHeaderLevelHeight } from 'app/core/components/AppChrome/TopBar/useChromeHeaderHeight';

import './LogsNavigation.css';

type Props = {
  logsSortOrder?: LogsSortOrder | null;
  scrollToTopLogs: () => void;
  scrollToBottomLogs?: () => void;
};

function LogsNavigation({ logsSortOrder, scrollToTopLogs }: Props) {
  const oldestLogsFirst = logsSortOrder === LogsSortOrder.Ascending;
  const newLogsPanelEnabled = useBooleanFlagValue('newLogsPanel', true);

  const onScrollToTopClick = useCallback(() => {
    reportInteraction('grafana_explore_logs_scroll_top_clicked');
    scrollToTopLogs();
  }, [scrollToTopLogs]);

  return (
    <div
      {...stylex.props(
        styles.navContainer,
        styles.navContainerHeight(getChromeHeaderLevelHeight()),
        oldestLogsFirst && !newLogsPanelEnabled && styles.navContainerNarrow
      )}
    >
      <Button
        data-testid="scrollToTop"
        className="gf-explore-logs-scroll-to-top"
        variant="secondary"
        onClick={onScrollToTopClick}
        title={t('logs.logs-navigation.scroll-top', 'Scroll to top')}
      >
        <Icon name="arrow-up" size="lg" />
      </Button>
    </div>
  );
}

export default memo(LogsNavigation);

const styles = stylex.create({
  navContainer: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'sticky',
    top: spacing['--gf-spacing-x2'],
    right: 0,
  },
  navContainerHeight: (chromeHeaderLevelHeight: number) => ({
    maxHeight: `calc(100vh - 2*${spacing['--gf-spacing-x2']} - 2*${chromeHeaderLevelHeight}px)`,
  }),
  navContainerNarrow: {
    width: '58px',
  },
});
