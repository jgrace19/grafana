import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { recentlyViewedDashboardsStyles } from './RecentlyViewedDashboards.stylex';
import { useEffect, useState } from 'react';
import { useAsyncRetry } from 'react-use';

import { t, Trans } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Button, CollapsableSection, Grid, Spinner, Stack, Text } from '@grafana/ui';
import { useMediaQueryMinWidth } from 'app/core/hooks/useMediaQueryMinWidth';
import { contextSrv } from 'app/core/services/context_srv';
import { useDashboardLocationInfo } from 'app/features/search/hooks/useDashboardLocationInfo';
import { DashListItem } from 'app/plugins/panel/dashlist/DashListItem';

import { getRecentlyViewedDashboards } from '../api/recentlyViewed';

const MAX_RECENT = 5;

const recentDashboardsKey = `dashboard_impressions-${contextSrv.user.orgId}`;

export function RecentlyViewedDashboards() {
  const isMediumScreen = !useMediaQueryMinWidth('md');
  const [isOpen, setIsOpen] = useState(!isMediumScreen); // Default to closed on small screens

  const {
    value: recentDashboards = [],
    loading,
    retry,
    error,
  } = useAsyncRetry(async () => {
    return getRecentlyViewedDashboards(MAX_RECENT);
  }, []);
  const { foldersByUid } = useDashboardLocationInfo(recentDashboards.length > 0);

  const handleClearHistory = () => {
    reportInteraction('grafana_recently_viewed_dashboards_clear_history');
    store.set(recentDashboardsKey, JSON.stringify([]));
    retry();
  };

  const handleSectionToggle = () => {
    reportInteraction('grafana_recently_viewed_dashboards_toggle_section', {
      expanded: !isOpen,
    });
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Auto collapse on small screens and expand on larger screens
    setIsOpen(!isMediumScreen);
  }, [isMediumScreen]);

  if (recentDashboards.length === 0) {
    return null;
  }

  return (
    <CollapsableSection
      headerDataTestId="browseDashboardsRecentlyViewedTitle"
      label={
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" width="100%">
          <Text variant="h5" element="h3" onClick={handleSectionToggle}>
            <Trans i18nKey="browse-dashboards.recently-viewed.title">Recently viewed</Trans>
          </Text>
          <Button icon="times" size="xs" variant="secondary" fill="text" onClick={handleClearHistory}>
            {t('browse-dashboards.recently-viewed.clear', 'Clear history')}
          </Button>
        </Stack>
      }
      isOpen={isOpen}
      // passing empty function to disable controlled mode, we only want to control isOpen when click on title
      // this avoid entire header section being clickable which can be confusing with the Clear history button
      onToggle={() => {}}
      {...stylex.props(recentlyViewedDashboardsStyles.title)}
      contentClassName={mergeStylexClassName(stylex.props(recentlyViewedDashboardsStyles.content), undefined).className}
    >
      {error && (
        <>
          <Text color="secondary">
            <Trans i18nKey="browse-dashboards.recently-viewed.error">
              Recently viewed dashboards couldn’t be loaded.
            </Trans>
          </Text>
          <Button onClick={retry} size="xs" fill="text">
            {t('browse-dashboards.recently-viewed.retry', 'Retry')}
          </Button>
        </>
      )}
      {loading && <Spinner />}

      {!loading && recentDashboards.length > 0 && (
        <ul {...stylex.props(recentlyViewedDashboardsStyles.list)}>
          <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} gap={2}>
            {recentDashboards.map((dash, idx) => (
              <li key={dash.uid} {...stylex.props(recentlyViewedDashboardsStyles.listItem)}>
                <DashListItem
                  order={idx + 1}
                  key={dash.uid}
                  dashboard={dash}
                  url={dash.url}
                  showFolderNames={true}
                  locationInfo={foldersByUid[dash.location]}
                  layoutMode="card"
                  source="browseDashboardsPage_RecentlyViewedCard"
                />
              </li>
            ))}
          </Grid>
        </ul>
      )}
    </CollapsableSection>
  );
}

;
