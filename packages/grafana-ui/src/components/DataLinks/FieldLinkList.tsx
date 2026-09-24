import * as stylex from '@stylexjs/stylex';

import { type Field, type LinkModel } from '@grafana/data';
import { Trans } from '@grafana/i18n';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';

import { DataLinkButton } from './DataLinkButton';

type Props = {
  links: Array<LinkModel<Field>>;
};

/**
 * @internal
 */
export function FieldLinkList({ links }: Props) {
  if (links.length === 1) {
    return <DataLinkButton link={links[0]} />;
  }

  const externalLinks = links.filter((link) => link.target === '_blank');
  const internalLinks = links.filter((link) => link.target === '_self');

  return (
    <>
      {internalLinks.map((link, i) => {
        return <DataLinkButton key={i} link={link} />;
      })}
      <div {...stylex.props(styles.wrapper)}>
        <p {...stylex.props(styles.externalLinksHeading)}>
          <Trans i18nKey="grafana-ui.field-link-list.external-links-heading">External links</Trans>
        </p>
        {externalLinks.map((link, i) => (
          <a key={i} href={link.href} target={link.target} {...stylex.props(styles.externalLink)}>
            <Icon name="external-link-alt" />
            {link.title}
          </a>
        ))}
      </div>
    </>
  );
}

const styles = stylex.create({
  wrapper: {
    flexBasis: '150px',
    width: '100px',
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  externalLinksHeading: {
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    fontSize: typography['--gf-typography-size-sm'],
    margin: 0,
  },
  externalLink: {
    color: colors['--gf-colors-text-link'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: { default: null, ':hover': 'underline' },
  },
});
