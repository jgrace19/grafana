import clsx from 'clsx';

import { type DataSourcePluginMeta, type GrafanaTheme2 } from '@grafana/data';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Card, LinkButton, PluginSignatureBadge, } from '@grafana/ui';

export type Props = {
  dataSourcePlugin: DataSourcePluginMeta;
  onClick: () => void;
};

export function DataSourceTypeCard({ onClick, dataSourcePlugin }: Props) {
  const isPhantom = dataSourcePlugin.module === 'phantom';
  const isClickable = !isPhantom && !dataSourcePlugin.unlicensed;
  const learnMoreLink = dataSourcePlugin.info?.links?.length > 0 ? dataSourcePlugin.info.links[0] : null;
  const learnMoreLinkTarget = learnMoreLink?.target ?? '_blank';

  const styles = (getStyles);

  return (
    <Card noMargin {...mergeStylexClassName(stylex.props(dataSourceTypeCardStyles.card, , 'card-parent'), undefined)} onClick={isClickable ? onClick : () => {}}>
      {/* Name */}
      <Card.Heading
        {...stylex.props(dataSourceTypeCardStyles.heading)}
        data-testid={e2eSelectors.pages.AddDataSource.dataSourcePluginsV2(dataSourcePlugin.name)}
      >
        {dataSourcePlugin.name}
      </Card.Heading>

      {/* Logo */}
      <Card.Figure align="center" {...stylex.props(dataSourceTypeCardStyles.figure)}>
        <img {...stylex.props(dataSourceTypeCardStyles.logo)} src={dataSourcePlugin.info.logos.small} alt="" />
      </Card.Figure>

      <Card.Description {...stylex.props(dataSourceTypeCardStyles.description)}>{dataSourcePlugin.info.description}</Card.Description>

      {/* Signature */}
      {!isPhantom && (
        <Card.Meta {...stylex.props(dataSourceTypeCardStyles.meta)}>
          <PluginSignatureBadge status={dataSourcePlugin.signature} />
        </Card.Meta>
      )}

      {/* Learn more */}
      <Card.Actions {...stylex.props(dataSourceTypeCardStyles.actions)}>
        {learnMoreLink && (
          <LinkButton
            aria-label={t(
              'datasources.data-source-type-card.aria-label-learn-more',
              '{{dataSourcePluginName}}, learn more.',
              { dataSourcePluginName: dataSourcePlugin.name }
            )}
            href={`${learnMoreLink.url}?utm_source=grafana_add_ds`}
            onClick={(e) => e.stopPropagation()}
            rel="noopener"
            target={learnMoreLinkTarget}
            variant="secondary"
          >
            {learnMoreLink.name}
          </LinkButton>
        )}
      </Card.Actions>
    </Card>
  );
}

