import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { cardGridStyles } from './CardGrid.stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { featureEnabled } from '@grafana/runtime';
import { Badge, Card, Grid, Stack } from '@grafana/ui';
import { PluginDeprecatedBadge } from 'app/features/plugins/admin/components/Badges/PluginDeprecatedBadge';
import { PluginDisabledBadge } from 'app/features/plugins/admin/components/Badges/PluginDisabledBadge';
import { PluginInstalledBadge } from 'app/features/plugins/admin/components/Badges/PluginInstallBadge';
import { PluginUpdateAvailableBadge } from 'app/features/plugins/admin/components/Badges/PluginUpdateAvailableBadge';
import { getBadgeColor } from 'app/features/plugins/admin/components/Badges/sharedStyles';
import { isPluginUpdatable } from 'app/features/plugins/admin/helpers';
import { type CatalogPlugin } from 'app/features/plugins/admin/types';


function PluginEnterpriseBadgeWithoutSignature() {
  const customBadgeStyles = (getBadgeColor);

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
      className={customBadgeStyles}
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
          {...stylex.props(cardGridStyles.card)}
          href={item.url}
          onClick={(e) => {
            if (onClickItem) {
              onClickItem(e, item);
            }
          }}
        >
          <Card.Heading {...stylex.props(cardGridStyles.heading)}>{item.name}</Card.Heading>

          <Card.Figure align="center" {...stylex.props(cardGridStyles.figure)}>
            <img {...stylex.props(cardGridStyles.logo)} src={item.logo} alt="" />
          </Card.Figure>
          <Card.Meta {...stylex.props(cardGridStyles.meta)}>
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
