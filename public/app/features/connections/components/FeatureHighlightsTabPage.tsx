import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { featureHighlightsTabPageStyles } from './FeatureHighlightsTabPage.stylex';
import { useParams } from 'react-router-dom-v5-compat';

import { Trans } from '@grafana/i18n';
import { Icon, LinkButton, TextLink } from '@grafana/ui';
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
        <div {...stylex.props(featureHighlightsTabPageStyles.container)}>
          <div {...stylex.props(featureHighlightsTabPageStyles.content)}>
            <div {...stylex.props(featureHighlightsTabPageStyles.badge)}>
              <CloudEnterpriseBadge />
            </div>
            <h1 {...stylex.props(featureHighlightsTabPageStyles.title)}>{title}</h1>
            <div {...stylex.props(featureHighlightsTabPageStyles.header)}>{header}</div>
            <div {...stylex.props(featureHighlightsTabPageStyles.itemsList)}>
              {items.map((item) => (
                <div key={item} {...stylex.props(featureHighlightsTabPageStyles.listItem)}>
                  <Icon {...stylex.props(featureHighlightsTabPageStyles.icon)} name="check" />
                  {item}
                </div>
              ))}
            </div>
            <div {...stylex.props(featureHighlightsTabPageStyles.footer)}>
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
            <LinkButton {...stylex.props(featureHighlightsTabPageStyles.linkButton)} href={buttonLink}>
              <Icon name="external-link-alt" {...stylex.props(featureHighlightsTabPageStyles.buttonIcon)} />
              <Trans i18nKey="connections.feature-highlight-page.link-button-label">Create account</Trans>
            </LinkButton>
            <p {...stylex.props(featureHighlightsTabPageStyles.footNote)}>
              <Trans i18nKey="connections.feature-highlight-page.foot-note">
                After creating an account, you can easily{' '}
                <TextLink href="https://grafana.com/docs/grafana/latest/administration/migration-guide/cloud-migration-assistant/">
                  migrate this instance to Grafana Cloud
                </TextLink>{' '}
                with our Migration Assistant.
              </Trans>
            </p>
          </div>
          <div {...stylex.props(featureHighlightsTabPageStyles.imageContainer)}>
            <img {...stylex.props(featureHighlightsTabPageStyles.image)} src={screenshotPath} alt={`${pageName} screenshot`} />
          </div>
        </div>
      </Page.Contents>
    </Page>
  );
}

