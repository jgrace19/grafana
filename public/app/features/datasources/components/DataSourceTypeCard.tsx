// eslint-disable-next-line no-restricted-imports -- stylex: pending Card xstyle
import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { type DataSourcePluginMeta } from '@grafana/data';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Card, LinkButton, PluginSignatureBadge } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
    <Card noMargin className={cx(cardStyles.card, 'card-parent')} onClick={isClickable ? onClick : () => {}}>
      {/* Name */}
      <Card.Heading
        className={cardStyles.heading}
        data-testid={e2eSelectors.pages.AddDataSource.dataSourcePluginsV2(dataSourcePlugin.name)}
      >
        {dataSourcePlugin.name}
      </Card.Heading>

      {/* Logo */}
      <Card.Figure align="center" className={cardStyles.figure}>
        <img {...stylex.props(styles.logo)} src={dataSourcePlugin.info.logos.small} alt="" />
      </Card.Figure>

      <Card.Description className={cardStyles.description}>{dataSourcePlugin.info.description}</Card.Description>

      {/* Signature */}
      {!isPhantom && (
        <Card.Meta className={cardStyles.meta}>
          <PluginSignatureBadge status={dataSourcePlugin.signature} />
        </Card.Meta>
      )}

      {/* Learn more */}
      <Card.Actions className={cardStyles.actions}>
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

const styles = stylex.create({
  logo: {
    marginRight: spacing['--gf-spacing-x3'],
    marginLeft: spacing['--gf-spacing-x1'],
    width: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
    maxHeight: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
  },
});

// stylex: pending Card xstyle. Card is StyleX but only takes className, and only an (unlayered) Emotion class
// reliably overrides Card's grid template, heading font, figure size, description/meta/actions margins.
const cardStyles = {
  heading: css({
    fontSize: typography['--gf-typography-h5-font-size'],
    fontWeight: 'inherit',
  }),
  figure: css({
    width: 'inherit',
    marginRight: '0px',
    '> img': {
      width: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
    },
  }),
  meta: css({
    marginTop: '6px',
    position: 'relative',
  }),
  description: css({
    margin: '0px',
    fontSize: typography['--gf-typography-size-sm'],
  }),
  actions: css({
    position: 'relative',
    alignSelf: 'center',
    marginTop: '0px',
    opacity: 0,

    '.card-parent:hover &, .card-parent:focus-within &': {
      opacity: 1,
    },
  }),
  card: css({
    gridTemplateAreas: `
        "Figure   Heading   Actions"
        "Figure Description Actions"
        "Figure    Meta     Actions"
        "Figure     -       Actions"`,
  }),
};
