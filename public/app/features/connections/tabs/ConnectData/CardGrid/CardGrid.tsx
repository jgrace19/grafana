// eslint-disable-next-line no-restricted-imports -- stylex: pending Card xstyle
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { featureEnabled } from '@grafana/runtime';
import { Badge, Card, Grid, Stack } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { PluginDeprecatedBadge } from 'app/features/plugins/admin/components/Badges/PluginDeprecatedBadge';
import { PluginDisabledBadge } from 'app/features/plugins/admin/components/Badges/PluginDisabledBadge';
import { PluginInstalledBadge } from 'app/features/plugins/admin/components/Badges/PluginInstallBadge';
import { PluginUpdateAvailableBadge } from 'app/features/plugins/admin/components/Badges/PluginUpdateAvailableBadge';
import { badgeColorStyle } from 'app/features/plugins/admin/components/Badges/sharedStyles';
import { isPluginUpdatable } from 'app/features/plugins/admin/helpers';
import { type CatalogPlugin } from 'app/features/plugins/admin/types';

function PluginEnterpriseBadgeWithoutSignature() {
  if (featureEnabled('enterprise.plugins')) {
    return <Badge text={t('get-enterprise.title', 'Enterprise')} color="blue" />;
  }

  return (
    <Badge
      icon="lock"
      role="img"
      aria-label={t('lock-icon', 'lock icon')}
      text={t('get-enterprise.title', 'Enterprise')}
      color="darkgrey"
      style={badgeColorStyle}
      title={t('get-enterprise.requires-license', 'Requires a Grafana Enterprise license')}
    />
  );
}

export type CardGridItem = CatalogPlugin & {
  logo?: string;
};

export interface CardGridProps {
  items: CardGridItem[];
  onClickItem?: (e: React.MouseEvent<HTMLElement>, item: CardGridItem) => void;
}

export const CardGrid = ({ items, onClickItem }: CardGridProps) => {
  return (
    <Grid gap={1.5} minColumnWidth={44}>
      {items.map((item) => (
        <Card
          key={item.id}
          noMargin
          className={cardStyles.card}
          href={item.url}
          onClick={(e) => {
            if (onClickItem) {
              onClickItem(e, item);
            }
          }}
        >
          <Card.Heading className={cardStyles.heading}>{item.name}</Card.Heading>

          <Card.Figure align="center" className={cardStyles.figure}>
            <img {...stylex.props(styles.logo)} src={item.logo} alt="" />
          </Card.Figure>
          <Card.Meta className={cardStyles.meta}>
            <Stack height="auto" wrap="wrap">
              {item.isEnterprise && <PluginEnterpriseBadgeWithoutSignature />}
              {item.isDeprecated && <PluginDeprecatedBadge />}
              {item.isInstalled && <PluginInstalledBadge />}
              {item.isDisabled && <PluginDisabledBadge error={item.error} />}
              {isPluginUpdatable(item) && <PluginUpdateAvailableBadge plugin={item} />}
            </Stack>
          </Card.Meta>
        </Card>
      ))}
    </Grid>
  );
};

const styles = stylex.create({
  logo: {
    marginRight: spacing['--gf-spacing-x3'],
    marginLeft: spacing['--gf-spacing-x1'],
    width: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
    maxHeight: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
  },
});

// stylex: pending Card xstyle. Card is StyleX but only takes className, and only an (unlayered) Emotion class
// reliably overrides Card's grid template, heading font, figure size and meta margin.
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
  card: css({
    gridTemplateAreas: `
        "Figure   Heading   Actions"
        "Figure Description Actions"
        "Figure    Meta     Actions"
        "Figure     -       Actions"`,
  }),
};
