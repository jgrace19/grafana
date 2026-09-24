import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Button, Divider, Icon, IconButton } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { CloudBadge } from 'app/core/components/Branding/CloudBadge';
import { backendSrv } from 'app/core/services/backend_srv';
import { contextSrv } from 'app/core/services/context_srv';
import { isOpenSourceBuildOrUnlicenced } from 'app/features/admin/EnterpriseAuthFeaturesCard';

import './AdCard.css';

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
    <div {...stylex.props(styles.cardBody)} title={title}>
      <div {...stylex.props(styles.preHeader)}>
        <CloudBadge />
        <IconButton name="times" size="sm" onClick={onDismiss} aria-label={t('alerting.ad.close', 'Close')} />
      </div>
      <header {...stylex.props(styles.header)}>
        <img src={logoUrl} alt={title.concat(' logo')} {...stylex.props(styles.logo)} />
        <div {...stylex.props(styles.contentColumn)}>
          <h3 {...stylex.props(styles.title)}>{title}</h3>
          <p {...stylex.props(styles.description)}>{description}</p>
        </div>
      </header>
      <Divider />
      <div {...stylex.props(styles.itemsList)}>
        {items.map((item) => (
          <div key={item} {...stylex.props(styles.listItem)}>
            <Icon xstyle={styles.icon} name="check" />
            {item}
          </div>
        ))}
      </div>
      <Divider />
      <Button
        fill="solid"
        variant="secondary"
        onClick={() => window.open(href, '_blank')}
        className="gf-ad-card-button"
      >
        <Trans i18nKey="alerting.ad.learn-more">Learn more</Trans>
        <Icon name="external-link-alt" xstyle={styles.buttonIcon} />
      </Button>
    </div>
  );
}

const styles = stylex.create({
  logo: {
    objectFit: 'contain',
    width: '47px',
    height: '47px',
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x2'],
    paddingTop: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x8'],
  },

  contentColumn: {
    flex: '1',
  },

  title: {
    marginBottom: spacing['--gf-spacing-x1'],
    fontSize: typography['--gf-typography-h4-font-size'],
    fontWeight: typography['--gf-typography-h4-font-weight'],
    color: colors['--gf-colors-text-primary'],
  },

  description: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
  },

  itemsList: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', [bp.xlUp]: '1fr 1fr' },
    gap: { default: spacing['--gf-spacing-x0-5'], [bp.xlUp]: spacing['--gf-spacing-x1'] },
  },

  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    marginBottom: spacing['--gf-spacing-x0-5'],
  },

  icon: {
    marginRight: spacing['--gf-spacing-x1'],
    color: colors['--gf-colors-success-main'],
  },

  buttonIcon: {
    marginLeft: spacing['--gf-spacing-x1'],
  },

  cardBody: {
    paddingTop: spacing['--gf-spacing-x3'],
    paddingRight: spacing['--gf-spacing-x4'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2.25)`,
    paddingLeft: spacing['--gf-spacing-x4'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-lg'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    flex: '1',
  },

  preHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
