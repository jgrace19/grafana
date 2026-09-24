import * as stylex from '@stylexjs/stylex';

import { reportInteraction } from '@grafana/runtime';
import { Card, Icon, Link, Stack, Text, useTheme2 } from '@grafana/ui';
import { type LocationInfo } from 'app/features/search/service/types';
import { StarToolbarButton } from 'app/features/stars/StarToolbarButton';

import { type Dashboard } from './DashList';
import { dashlistCardMarker, dashlistLinkMarker } from './markers.stylex';
import { getCardHoverGradientStyle, styles } from './styles';

interface Props {
  dashboard: Dashboard;
  url: string;
  showFolderNames: boolean;
  locationInfo?: LocationInfo;
  layoutMode: 'list' | 'card';
  source: string; // for rudderstack analytics to track which page DashListItem click from
  order?: number; // for rudderstack analytics to track position in cards
  onStarChange?: (id: string, isStarred: boolean) => void;
}
export function DashListItem({
  dashboard,
  url,
  showFolderNames,
  locationInfo,
  layoutMode,
  order,
  onStarChange,
  source,
}: Props) {
  const theme = useTheme2();

  const onCardLinkClick = () => {
    reportInteraction('grafana_browse_dashboards_page_click_list_item', {
      itemKind: dashboard.kind,
      source,
      uid: dashboard.uid,
      cardOrder: order,
    });
  };

  return (
    <>
      {layoutMode === 'list' ? (
        <div {...stylex.props(styles.dashlistLink)}>
          <Link href={url} className={stylex.props(styles.dashlistLinkAnchor, dashlistLinkMarker).className}>
            <Text element="p" xstyle={styles.dashlistLinkName}>
              {dashboard.name}
            </Text>
            {showFolderNames && locationInfo && (
              <Text color="secondary" variant="bodySmall" element="p">
                {locationInfo?.name}
              </Text>
            )}
          </Link>
          <StarToolbarButton
            title={dashboard.name}
            group="dashboard.grafana.app"
            kind="Dashboard"
            id={dashboard.uid}
            onStarChange={onStarChange}
          />
        </div>
      ) : (
        <Card noMargin xstyle={styles.cardContainer} style={getCardHoverGradientStyle(theme)}>
          <Stack justifyContent="space-between" alignItems="start" height="100%">
            <Link
              className={stylex.props(styles.dashlistCard, dashlistCardMarker).className}
              href={url}
              aria-label={dashboard.name}
              title={dashboard.name}
              onClick={onCardLinkClick}
            >
              <div {...stylex.props(styles.dashlistCardLink)}>{dashboard.name}</div>

              {showFolderNames && locationInfo && (
                <Stack alignItems="start" direction="row" gap={0.5}>
                  <Icon name="folder" size="sm" xstyle={styles.dashlistCardIcon} aria-hidden="true" />
                  <div {...stylex.props(styles.dashlistCardFolder)}>
                    <Text
                      color="secondary"
                      variant="bodySmall"
                      element="p"
                      aria-label={locationInfo?.name}
                      title={locationInfo?.name}
                    >
                      {locationInfo?.name}
                    </Text>
                  </div>
                </Stack>
              )}
            </Link>

            <StarToolbarButton
              title={dashboard.name}
              group="dashboard.grafana.app"
              kind="Dashboard"
              id={dashboard.uid}
              onStarChange={onStarChange}
            />
          </Stack>
        </Card>
      )}
    </>
  );
}
