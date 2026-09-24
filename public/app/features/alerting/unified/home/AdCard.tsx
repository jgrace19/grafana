import * as stylex from '@stylexjs/stylex';
import { adCardStyles } from './AdCard.stylex';
import { useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Button, Divider, Icon, IconButton } from '@grafana/ui';
import { CloudBadge } from 'app/core/components/Branding/CloudBadge';
import { backendSrv } from 'app/core/services/backend_srv';
import { contextSrv } from 'app/core/services/context_srv';
import { isOpenSourceBuildOrUnlicenced } from 'app/features/admin/EnterpriseAuthFeaturesCard';

type AdCardProps = {
  title: string;
  description: string;
  href: string;
  logoUrl: string;
  items: string[];
  helpFlag: number;
};

export default function AdCard({ title, description, href, logoUrl, items, helpFlag }: AdCardProps) {

  const helpFlags = contextSrv.user.helpFlags1;
  const [isDismissed, setDismissed] = useState<boolean>(Boolean(helpFlags & helpFlag));

  const onDismiss = () => {
    backendSrv.put(`/api/user/helpflags/${helpFlag}`, undefined, { showSuccessAlert: false }).then((res) => {
      contextSrv.user.helpFlags1 = res.helpFlags1;
      setDismissed(true);
    });
  };

  if (isDismissed || !isOpenSourceBuildOrUnlicenced()) {
    return null;
  }

  return (
    <div {...stylex.props(formStyles.cardBody)} title={title}>
      <div {...stylex.props(formStyles.preHeader)}>
        <CloudBadge />
        <IconButton name="times" size="sm" onClick={onDismiss} aria-label={t('alerting.ad.close', 'Close')} />
      </div>
      <header {...stylex.props(formStyles.header)}>
        <img src={logoUrl} alt={title.concat(' logo')} {...stylex.props(formStyles.logo)} />
        <div {...stylex.props(formStyles.contentColumn)}>
          <h3 {...stylex.props(formStyles.title)}>{title}</h3>
          <p {...stylex.props(formStyles.description)}>{description}</p>
        </div>
      </header>
      <Divider />
      <div {...stylex.props(formStyles.itemsList)}>
        {items.map((item) => (
          <div key={item} {...stylex.props(formStyles.listItem)}>
            <Icon {...stylex.props(formStyles.icon)} name="check" />
            {item}
          </div>
        ))}
      </div>
      <Divider />
      <Button fill="solid" variant="secondary" onClick={() => window.open(href, '_blank')} {...stylex.props(formStyles.button)}>
        <Trans i18nKey="alerting.ad.learn-more">Learn more</Trans>
        <Icon name="external-link-alt" {...stylex.props(formStyles.buttonIcon)} />
      </Button>
    </div>
  );
}

