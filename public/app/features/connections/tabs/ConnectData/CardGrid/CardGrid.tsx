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
import { badgeColorStyles } from 'app/features/plugins/admin/components/Badges/sharedStyles';
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
      xstyle={badgeColorStyles.badge}
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
          xstyle={styles.card}
          href={item.url}
          onClick={(e) => {
            if (onClickItem) {
              onClickItem(e, item);
            }
          }}
        >
          <Card.Heading xstyle={styles.heading}>{item.name}</Card.Heading>

          <Card.Figure align="center" xstyle={styles.figure}>
            {/* Inline so the width beats Card's unlayered `.gf-card-figure > img` rule. */}
            <img {...stylex.props(styles.logo)} style={{ width: logoWidth }} src={item.logo} alt="" />
          </Card.Figure>
          <Card.Meta xstyle={styles.meta}>
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
  card: {
    gridTemplateAreas: `
        "Figure   Heading   Actions"
        "Figure Description Actions"
        "Figure    Meta     Actions"
        "Figure     -       Actions"`,
  },
});
