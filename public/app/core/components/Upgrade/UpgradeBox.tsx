import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { upgradeBoxStyles } from './UpgradeBox.stylex';
import { type HTMLAttributes, useEffect } from 'react';

import { Trans, t } from '@grafana/i18n';
import { reportExperimentView } from '@grafana/runtime';
import { Button, Icon, LinkButton } from '@grafana/ui';

type ComponentSize = 'sm' | 'md';

export interface Props extends HTMLAttributes<HTMLOrSVGElement> {
  featureName: string;
  size?: ComponentSize;
  text?: string;
  eventVariant?: string;
  featureId: string;
}

export const UpgradeBox = ({
  featureName,
  className,
  children,
  text,
  featureId,
  eventVariant = '',
  size = 'md',
  ...htmlProps
}: Props) => {

  useEffect(() => {
    reportExperimentView(`feature-highlights-${featureId}`, 'test', eventVariant);
  }, [eventVariant, featureId]);

  return (
    <div
      {...mergeStylexClassName(
        stylex.props(upgradeBoxStyles.box, size === 'sm' && upgradeBoxStyles.boxSmall),
        className
      )}
      {...htmlProps}
    >
      <Icon name={'rocket'} {...stylex.props(upgradeBoxStyles.icon)} />
      <div {...stylex.props(upgradeBoxStyles.inner)}>
        <p {...stylex.props(upgradeBoxStyles.text)}>
          <Trans i18nKey="upgrade-box.discovery-text">You’ve discovered a Pro feature!</Trans>{' '}
          {text ||
            t('upgrade-box.discovery-text-continued', 'Get the Grafana Pro plan to access {{featureName}}.', {
              featureName,
            })}
        </p>
        <LinkButton
          variant="secondary"
          size={size}
          {...stylex.props(upgradeBoxStyles.button)}
          href="https://grafana.com/profile/org/subscription"
          target="__blank"
          rel="noopener noreferrer"
        >
          <Trans i18nKey="upgrade-box.upgrade-button">Upgrade</Trans>
        </LinkButton>
      </div>
    </div>
  );
};


export interface UpgradeContentProps {
  image: string;
  featureUrl?: string;
  featureName: string;
  description?: string;
  listItems: string[];
  caption?: string;
  action?: {
    text: string;
    link?: string;
    onClick?: () => void;
  };
}

export const UpgradeContent = ({
  listItems,
  image,
  featureUrl,
  featureName,
  description,
  caption,
  action,
}: UpgradeContentProps) => {
  return (
    <div {...stylex.props(upgradeBoxStyles.container)}>
      <div {...stylex.props(upgradeBoxStyles.content)}>
        <h3 {...stylex.props(upgradeBoxStyles.title)}>
          <Trans i18nKey="upgrade-box.get-started">Get started with {{ featureName }}</Trans>
        </h3>
        {description && <h6 {...stylex.props(upgradeBoxStyles.description)}>{description}</h6>}
        <ul {...stylex.props(upgradeBoxStyles.list)}>
          {listItems.map((item, index) => (
            <li key={index} {...stylex.props(upgradeBoxStyles.listItem)}>
              <Icon name={'check'} size={'xl'} {...stylex.props(upgradeBoxStyles.listIcon)} /> {item}
            </li>
          ))}
        </ul>
        {action?.link && (
          <LinkButton variant={'primary'} href={action.link}>
            {action.text}
          </LinkButton>
        )}
        {action?.onClick && (
          <Button variant={'primary'} onClick={action.onClick}>
            {action.text}
          </Button>
        )}
        {featureUrl && (
          <LinkButton fill={'text'} href={featureUrl} {...stylex.props(upgradeBoxStyles.link)} target="_blank" rel="noreferrer noopener">
            <Trans i18nKey="upgrade-box.learn-more">Learn more</Trans>
          </LinkButton>
        )}
      </div>
      <div {...stylex.props(upgradeBoxStyles.media)}>
        <img {...stylex.props(upgradeBoxStyles.mediaImage)} src={getImgUrl(image)} alt={'Feature screenshot'} />
        {caption && <p {...stylex.props(upgradeBoxStyles.caption)}>{caption}</p>}
      </div>
    </div>
  );
};

export const UpgradeContentVertical = ({
  featureName,
  description,
  featureUrl,
  image,
}: Omit<UpgradeContentProps, 'listItems' | 'caption'>) => {
  return (
    <div {...stylex.props(upgradeBoxStyles.containerVertical)}>
      <h3 {...stylex.props(upgradeBoxStyles.title)}>
        <Trans i18nKey="upgrade-box.get-started">Get started with {{ featureName }}</Trans>
      </h3>
      {description && <h6 {...stylex.props(upgradeBoxStyles.description)}>{description}</h6>}
      <LinkButton fill={'text'} href={featureUrl} target="_blank" rel="noreferrer noopener">
        <Trans i18nKey="upgrade-box.learn-more">Learn more</Trans>
      </LinkButton>
      <div {...stylex.props(upgradeBoxStyles.mediaVertical)}>
        <img {...stylex.props(upgradeBoxStyles.mediaImage)} src={getImgUrl(image)} alt={'Feature screenshot'} />
      </div>
    </div>
  );
};

const getImgUrl = (urlOrId: string) => {
  if (urlOrId.startsWith('http')) {
    return urlOrId;
  }

  return '/public/build/img/enterprise/highlights/' + urlOrId;
};
