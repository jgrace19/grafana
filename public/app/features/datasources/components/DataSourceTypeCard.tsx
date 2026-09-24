import * as stylex from '@stylexjs/stylex';

import { type DataSourcePluginMeta } from '@grafana/data';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Card, LinkButton, PluginSignatureBadge } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { dataSourceTypeCardMarker } from './markers.stylex';

export type Props = {
  dataSourcePlugin: DataSourcePluginMeta;
  onClick: () => void;
};

export function DataSourceTypeCard({ onClick, dataSourcePlugin }: Props) {
  const isPhantom = dataSourcePlugin.module === 'phantom';
  const isClickable = !isPhantom && !dataSourcePlugin.unlicensed;
  const learnMoreLink = dataSourcePlugin.info?.links?.length > 0 ? dataSourcePlugin.info.links[0] : null;
  const learnMoreLinkTarget = learnMoreLink?.target ?? '_blank';

  return (
    <Card
      noMargin
      className={stylex.props(dataSourceTypeCardMarker).className}
      xstyle={styles.card}
      onClick={isClickable ? onClick : () => {}}
    >
      {/* Name */}
      <Card.Heading
        xstyle={styles.heading}
        data-testid={e2eSelectors.pages.AddDataSource.dataSourcePluginsV2(dataSourcePlugin.name)}
      >
        {dataSourcePlugin.name}
      </Card.Heading>

      {/* Logo */}
      <Card.Figure align="center" xstyle={styles.figure}>
        {/* Inline so the width beats Card's unlayered `.gf-card-figure > img` rule. */}
        <img
          {...stylex.props(styles.logo)}
          style={{ width: logoWidth }}
          src={dataSourcePlugin.info.logos.small}
          alt=""
        />
      </Card.Figure>

      <Card.Description xstyle={styles.description}>{dataSourcePlugin.info.description}</Card.Description>

      {/* Signature */}
      {!isPhantom && (
        <Card.Meta xstyle={styles.meta}>
          <PluginSignatureBadge status={dataSourcePlugin.signature} />
        </Card.Meta>
      )}

      {/* Learn more */}
      <Card.Actions xstyle={styles.actions}>
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

const logoWidth = `calc(${spacing['--gf-spacing-grid-size']} * 7)`;

const styles = stylex.create({
  logo: {
    marginRight: spacing['--gf-spacing-x3'],
    marginLeft: spacing['--gf-spacing-x1'],
    maxHeight: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
  },
  heading: {
    fontSize: typography['--gf-typography-h5-font-size'],
    fontWeight: 'inherit',
  },
  figure: {
    width: 'inherit',
    marginRight: '0px',
  },
  meta: {
    marginTop: '6px',
    position: 'relative',
  },
  description: {
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    fontSize: typography['--gf-typography-size-sm'],
  },
  actions: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: '0px',
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover', dataSourceTypeCardMarker)]: 1,
      [stylex.when.ancestor(':focus-within', dataSourceTypeCardMarker)]: 1,
    },
  },
  card: {
    gridTemplateAreas: `
        "Figure   Heading   Actions"
        "Figure Description Actions"
        "Figure    Meta     Actions"
        "Figure     -       Actions"`,
  },
});
