import { fieldLinkListStyleProps } from './FieldLinkList.stylex';
import { type Field, type LinkModel } from '@grafana/data';
import { Trans } from '@grafana/i18n';

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
      <div {...fieldLinkListStyleProps('wrapper')}>
        <p {...fieldLinkListStyleProps('externalLinksHeading')}>
          <Trans i18nKey="grafana-ui.field-link-list.external-links-heading">External links</Trans>
        </p>
        {externalLinks.map((link, i) => (
          <a key={i} href={link.href} target={link.target} {...fieldLinkListStyleProps('externalLink')}>
            <Icon name="external-link-alt" />
            {link.title}
          </a>
        ))}
      </div>
    </>
  );
}

