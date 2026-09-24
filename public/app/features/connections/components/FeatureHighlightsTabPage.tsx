import * as stylex from '@stylexjs/stylex';
import { useParams } from 'react-router-dom-v5-compat';

import { Trans } from '@grafana/i18n';
import { Icon, LinkButton, TextLink } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { CloudEnterpriseBadge } from 'app/core/components/Branding/CloudEnterpriseBadge';
import { Page } from 'app/core/components/Page/Page';
import { DataSourceTitle } from 'app/features/datasources/components/DataSourceTitle';
import { EditDataSourceActions } from 'app/features/datasources/components/EditDataSourceActions';
import { useDataSourceInfo } from 'app/features/datasources/components/useDataSourceInfo';
import { useInitDataSourceSettings } from 'app/features/datasources/state/hooks';

import { useDataSourceTabNav } from '../hooks/useDataSourceTabNav';

type FeatureHighlightsTabPageProps = {
  pageName: string;
  title: string;
  header: string;
  items: string[];
  buttonLink: string;
  screenshotPath: string;
};

export function FeatureHighlightsTabPage({
  pageName,
  title,
  header,
  items,
  buttonLink,
  screenshotPath,
}: FeatureHighlightsTabPageProps) {
  const { uid = '' } = useParams<{ uid: string }>();
  useInitDataSourceSettings(uid);

  const { navId, pageNav, dataSourceHeader } = useDataSourceTabNav(pageName);

  const info = useDataSourceInfo({
    dataSourcePluginName: pageNav.dataSourcePluginName,
    alertingSupported: dataSourceHeader.alertingSupported,
  });

  return (
    <Page
      navId={navId}
      pageNav={pageNav}
      renderTitle={(title) => <DataSourceTitle title={title} />}
      info={info}
      actions={<EditDataSourceActions uid={uid} />}
    >
      <Page.Contents>
        <div {...stylex.props(styles.container)}>
          <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.badge)}>
              <CloudEnterpriseBadge />
            </div>
            <h1 {...stylex.props(styles.title)}>{title}</h1>
            <div {...stylex.props(styles.header)}>{header}</div>
            <div {...stylex.props(styles.itemsList)}>
              {items.map((item) => (
                <div key={item} {...stylex.props(styles.listItem)}>
                  <Icon xstyle={styles.icon} name="check" />
                  {item}
                </div>
              ))}
            </div>
            <div {...stylex.props(styles.footer)}>
              <Trans i18nKey="connections.feature-highlight-page.footer">
                Create a Grafana Cloud Free account to start using data source permissions. This feature is also
                available with a Grafana Enterprise license.
              </Trans>
              <div>
                <TextLink href="https://grafana.com/products/enterprise/grafana/">
                  <Icon name="external-link-alt" />
                  <Trans i18nKey="connections.feature-highlight-page.footer-link">Learn about Enterprise</Trans>
                </TextLink>
              </div>
            </div>
            <LinkButton className={stylex.props(styles.linkButton).className} href={buttonLink}>
              <Icon name="external-link-alt" xstyle={styles.buttonIcon} />
              <Trans i18nKey="connections.feature-highlight-page.link-button-label">Create account</Trans>
            </LinkButton>
            <p {...stylex.props(styles.footNote)}>
              <Trans i18nKey="connections.feature-highlight-page.foot-note">
                After creating an account, you can easily{' '}
                <TextLink href="https://grafana.com/docs/grafana/latest/administration/migration-guide/cloud-migration-assistant/">
                  migrate this instance to Grafana Cloud
                </TextLink>{' '}
                with our Migration Assistant.
              </Trans>
            </p>
          </div>
          <div {...stylex.props(styles.imageContainer)}>
            <img {...stylex.props(styles.image)} src={screenshotPath} alt={`${pageName} screenshot`} />
          </div>
        </div>
      </Page.Contents>
    </Page>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x4'],
    alignItems: 'flex-start',
    flexDirection: { default: null, [bp.lgDown]: 'column' },
  },
  content: {
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: '40%',
  },
  imageContainer: {
    flex: { default: '0 0 60%', [bp.lgDown]: '1 1 auto' },
    display: 'flex',
    paddingTop: spacing['--gf-spacing-x5'],
    paddingRight: '10%',
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x5'],
  },
  image: {
    width: '100%',
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
  },
  buttonIcon: {
    marginRight: spacing['--gf-spacing-x1'],
  },
  badge: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
  title: {
    marginBottom: spacing['--gf-spacing-x2'],
    marginTop: spacing['--gf-spacing-x2'],
  },
  header: {
    color: colors['--gf-colors-text-primary'],
  },
  itemsList: {
    marginBottom: spacing['--gf-spacing-x3'],
    marginTop: spacing['--gf-spacing-x3'],
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    color: colors['--gf-colors-text-primary'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    marginBottom: spacing['--gf-spacing-x2'],
  },
  linkButton: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  footer: {
    marginBottom: spacing['--gf-spacing-x3'],
    marginTop: spacing['--gf-spacing-x3'],
  },
  icon: {
    marginRight: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-success-main'],
  },
  footNote: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
