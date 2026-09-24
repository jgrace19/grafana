import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logsNavigationStyles } from './LogsNavigation.stylex';
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import { memo, useCallback } from 'react';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, Icon, useTheme2 } from '@grafana/ui';
import { getChromeHeaderLevelHeight } from 'app/core/components/AppChrome/TopBar/useChromeHeaderHeight';

type Props = {
  logsSortOrder?: LogsSortOrder | null;
  scrollToTopLogs: () => void;
  scrollToBottomLogs?: () => void;
};

function LogsNavigation({ logsSortOrder, scrollToTopLogs }: Props) {
  const oldestLogsFirst = logsSortOrder === LogsSortOrder.Ascending;
  const newLogsPanelEnabled = useBooleanFlagValue('newLogsPanel', true);
  const theme = useTheme2();
  const styles = getStyles(theme, oldestLogsFirst, newLogsPanelEnabled);

  const onScrollToTopClick = useCallback(() => {
    reportInteraction('grafana_explore_logs_scroll_top_clicked');
    scrollToTopLogs();
  }, [scrollToTopLogs]);

  return (
    <div {...stylex.props(logsNavigationStyles.navContainer)}>
      <Button
        data-testid="scrollToTop"
        {...stylex.props(logsNavigationStyles.scrollToTopButton)}
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

