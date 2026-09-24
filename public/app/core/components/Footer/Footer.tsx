import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { type LinkTarget } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Icon, type IconName } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export interface FooterLink {
  target: LinkTarget;
  text: string;
  id: string;
  icon?: IconName;
  url?: string;
}

export let getFooterLinks = (): FooterLink[] => {
  return [
    {
      target: '_blank',
      id: 'documentation',
      text: t('nav.help/documentation', 'Documentation'),
      icon: 'document-info',
      url: 'https://grafana.com/docs/grafana/latest/?utm_source=grafana_footer',
    },
    {
      target: '_blank',
      id: 'support',
      text: t('nav.help/support', 'Support'),
      icon: 'question-circle',
      url: 'https://grafana.com/products/enterprise/?utm_source=grafana_footer',
    },
    {
      target: '_blank',
      id: 'community',
      text: t('nav.help/community', 'Community'),
      icon: 'comments-alt',
      url: 'https://community.grafana.com/?utm_source=grafana_footer',
    },
  ];
};

export function getVersionMeta(version: string) {
  const isBeta = version.includes('-beta');

  return {
    hasReleaseNotes: true,
    isBeta,
  };
}

export function getVersionLinks(hideEdition?: boolean): FooterLink[] {
  const { buildInfo, licenseInfo } = config;
  const links: FooterLink[] = [];
  const stateInfo = licenseInfo.stateInfo ? ` (${licenseInfo.stateInfo})` : '';

  if (!hideEdition) {
    links.push({
      target: '_blank',
      id: 'license',
      text: `${buildInfo.edition}${stateInfo}`,
      url: licenseInfo.licenseUrl,
    });
  }

  if (buildInfo.hideVersion) {
    return links;
  }

  const { hasReleaseNotes } = getVersionMeta(buildInfo.version);

  links.push({
    target: '_blank',
    id: 'version',
    text: buildInfo.versionString,
    url: hasReleaseNotes ? `https://github.com/grafana/grafana/blob/main/CHANGELOG.md` : undefined,
  });

  if (buildInfo.hasUpdate) {
    links.push({
      target: '_blank',
      id: 'updateVersion',
      text: 'New version available!',
      icon: 'download-alt',
      url: 'https://grafana.com/grafana/download?utm_source=grafana_footer',
    });
  }

  return links;
}

export function setFooterLinksFn(fn: typeof getFooterLinks) {
  getFooterLinks = fn;
}

export interface Props {
  /** Link overrides to show specific links in the UI */
  customLinks?: FooterLink[] | null;
  hideEdition?: boolean;
}

export const Footer = memo(({ customLinks, hideEdition }: Props) => {
  const links = (customLinks || getFooterLinks()).concat(getVersionLinks(hideEdition));

  return (
    <footer {...stylex.props(styles.footer)}>
      <div className="text-center">
        <ul {...stylex.props(styles.list)}>
          {links.map((link, index) => (
            <li {...stylex.props(styles.listItem, index === links.length - 1 && styles.listItemLast)} key={index}>
              <FooterItem item={link} />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

function FooterItem({ item }: { item: FooterLink }) {
  const content = item.url ? (
    <a {...stylex.props(styles.link)} href={item.url} target={item.target} rel="noopener noreferrer" id={item.id}>
      {item.text}
    </a>
  ) : (
    item.text
  );

  return (
    <>
      {item.icon && <Icon name={item.icon} />} {content}
    </>
  );
}

const styles = stylex.create({
  footer: {
    fontFamily: typography['--gf-typography-body-small-font-family'],
    fontWeight: typography['--gf-typography-body-small-font-weight'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    letterSpacing: typography['--gf-typography-body-small-letter-spacing'],
    color: colors['--gf-colors-text-primary'],
    display: { default: 'block', [bp.mdDown]: 'none' },
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x0'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x0'],
    position: 'relative',
    width: '98%',
  },
  link: {
    color: { default: null, ':hover': colors['--gf-colors-text-max-contrast'] },
    textDecoration: { default: null, ':hover': 'underline' },
  },
  list: {
    listStyle: 'none',
  },
  listItem: {
    display: 'inline-block',
    '::after': {
      content: "' | '",
      paddingTop: spacing['--gf-spacing-x0'],
      paddingRight: spacing['--gf-spacing-x1'],
      paddingBottom: spacing['--gf-spacing-x0'],
      paddingLeft: spacing['--gf-spacing-x1'],
    },
  },
  listItemLast: {
    '::after': {
      content: "''",
      paddingLeft: 0,
    },
  },
});
