import * as stylex from '@stylexjs/stylex';

import { type IconName, isIconName } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Page } from 'app/core/components/Page/Page';
import { useSelector } from 'app/types/store';

import { getConnectionsCardMetadata } from '../components/PageCard/CardMetadata';
import PageCard from '../components/PageCard/PageCard';

const FALLBACK_ICON: IconName = 'plug';

function resolveIcon(metaIcon: IconName | undefined, navIcon: string | undefined): IconName {
  if (metaIcon) {
    return metaIcon;
  }
  if (navIcon && isIconName(navIcon)) {
    return navIcon;
  }
  return FALLBACK_ICON;
}

export default function ConnectionsHomePage() {
  const isOnPrem = !config.pluginAdminExternalManageEnabled;
  const cardMetadata = getConnectionsCardMetadata(isOnPrem);
  const navIndex = useSelector((state) => state.navIndex);
  const cardsData = (navIndex['connections']?.children ?? [])
    .filter((item) => item.url)
    .map((item) => {
      const meta = cardMetadata[item.url!];
      return {
        ...item,
        text: meta?.text ?? item.text,
        icon: resolveIcon(meta?.icon, item.icon),
        subTitle: meta?.subTitle ?? item.subTitle ?? '',
      };
    });

  return (
    <Page
      navId="connections"
      pageNav={{
        text: '',
        active: true,
      }}
    >
      <Page.Contents>
        <div {...stylex.props(styles.centeredContainer)}>
          <h1 {...stylex.props(styles.mainTitle)}>
            <Trans i18nKey="connections.connections-home-page.welcome-to-connections">Welcome to Connections</Trans>
          </h1>
          <p {...stylex.props(styles.subTitle)}>
            {isOnPrem ? (
              <Trans i18nKey="connections.oss.connections-home-page.subtitle">
                Manage your data source connections in one place. Use this page to add a new data source or manage your
                existing connections.
              </Trans>
            ) : (
              <Trans i18nKey="connections.cloud.connections-home-page.subtitle">
                Connect your infrastructure to Grafana Cloud using data sources, integrations and apps. Use this page to
                add to manage everything from data ingestion to private connections and telemetry pipelines.
              </Trans>
            )}
          </p>
          {cardsData.length > 0 && (
            <section {...stylex.props(styles.cardsSection)}>
              {cardsData.map((child, index) => (
                <PageCard
                  key={child.id ?? index}
                  title={child.text}
                  description={child.subTitle}
                  icon={child.icon}
                  url={child.url!}
                  index={index}
                />
              ))}
            </section>
          )}
        </div>
      </Page.Contents>
    </Page>
  );
}

const styles = stylex.create({
  mainTitle: {
    textAlign: { default: 'left', [bp.smUp]: 'center' },
  },
  subTitle: {
    color: colors['--gf-colors-text-secondary'],
    textAlign: { default: 'left', [bp.smUp]: 'center' },
    maxWidth: { default: null, [bp.smUp]: `calc(${spacing['--gf-spacing-grid-size']} * 119)` },
  },
  cardsSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: { default: 'flex-start', [bp.smUp]: 'center' },
    gap: spacing['--gf-spacing-x4'],
    paddingTop: { default: spacing['--gf-spacing-x2'], [bp.smUp]: spacing['--gf-spacing-x6'] },
    paddingBottom: { default: spacing['--gf-spacing-x2'], [bp.smUp]: spacing['--gf-spacing-x6'] },
    width: '100%',
  },
  centeredContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { default: 'flex-start', [bp.smUp]: 'center' },
  },
});
