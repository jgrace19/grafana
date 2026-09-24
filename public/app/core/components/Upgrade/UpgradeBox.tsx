import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes, useEffect } from 'react';

import { Trans, t } from '@grafana/i18n';
import { reportExperimentView } from '@grafana/runtime';
import { Button, Icon, LinkButton } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { breakpointWidths } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...mergeStylexProps(stylex.props(boxStyles.box, sizeStyles[size]), { className })} {...htmlProps}>
      <Icon name={'rocket'} xstyle={boxStyles.icon} />
      <div {...stylex.props(boxStyles.inner)}>
        <p {...stylex.props(boxStyles.text)}>
          <Trans i18nKey="upgrade-box.discovery-text">You’ve discovered a Pro feature!</Trans>{' '}
          {text ||
            t('upgrade-box.discovery-text-continued', 'Get the Grafana Pro plan to access {{featureName}}.', {
              featureName,
            })}
        </p>
        <LinkButton
          variant="secondary"
          size={size}
          xstyle={buttonStyles.button}
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

const boxStyles = stylex.create({
  box: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: `calc(${shape['--gf-shape-radius-default']} * 2)`,
    backgroundColor: colors['--gf-colors-success-transparent'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    color: colors['--gf-colors-success-text'],
    textAlign: 'left',
    lineHeight: '16px',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: spacing['--gf-spacing-x3'],
    marginLeft: 'auto',
    maxWidth: breakpointWidths.xxl,
    width: '100%',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  text: {
    margin: 0,
  },
  icon: {
    marginTop: spacing['--gf-spacing-x0-5'],
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x0-5'],
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
});

// Over LinkButton's secondary solid look: its focus and active backgrounds and colours still apply, but the
// override's :hover and :focus-visible rules came after them, as in the merged Emotion class.
const buttonStyles = stylex.create({
  button: {
    fontWeight: typography['--gf-typography-font-weight-light'],
    backgroundColor: {
      default: colors['--gf-colors-success-main'],
      ':hover': colors['--gf-colors-success-main'],
      ':focus': { default: colors['--gf-colors-secondary-shade'], ':hover': colors['--gf-colors-success-main'] },
      ':active': { default: colors['--gf-colors-secondary-main'], ':hover': colors['--gf-colors-success-main'] },
    },
    color: {
      default: 'white',
      ':focus-visible': colors['--gf-colors-text-primary'],
      ':hover': {
        default: colors['--gf-colors-secondary-contrast-text'],
        ':focus-visible': colors['--gf-colors-text-primary'],
      },
      ':focus': {
        default: colors['--gf-colors-secondary-contrast-text'],
        ':focus-visible': colors['--gf-colors-text-primary'],
      },
    },
    boxShadow: {
      default: null,
      ':focus-visible': 'none',
      ':hover': { default: shadows['--gf-shadows-z1'], ':focus-visible': 'none' },
      ':focus': { default: null, ':not(:focus-visible)': 'none' },
    },
    outlineStyle: {
      default: null,
      ':focus-visible': 'solid',
      ':focus': { default: null, ':not(:focus-visible)': 'none' },
    },
    outlineColor: { default: null, ':focus-visible': colors['--gf-colors-primary-main'] },
  },
});

const sizeStyles = stylex.create({
  sm: {
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  md: {
    fontSize: typography['--gf-typography-body-font-size'],
  },
});

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
    <div {...stylex.props(contentStyles.container)}>
      <div {...stylex.props(contentStyles.content)}>
        <h3 {...stylex.props(contentStyles.title)}>
          <Trans i18nKey="upgrade-box.get-started">Get started with {{ featureName }}</Trans>
        </h3>
        {description && <h6 {...stylex.props(contentStyles.description)}>{description}</h6>}
        <ul {...stylex.props(contentStyles.list)}>
          {listItems.map((item, index) => (
            <li key={index} {...stylex.props(contentStyles.listItem)}>
              <Icon name={'check'} size={'xl'} xstyle={contentStyles.icon} /> {item}
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
          <LinkButton
            fill={'text'}
            href={featureUrl}
            className={stylex.props(contentStyles.link).className}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Trans i18nKey="upgrade-box.learn-more">Learn more</Trans>
          </LinkButton>
        )}
      </div>
      <div {...stylex.props(contentStyles.media)}>
        <img {...stylex.props(contentStyles.mediaImg)} src={getImgUrl(image)} alt={'Feature screenshot'} />
        {caption && <p {...stylex.props(contentStyles.caption)}>{caption}</p>}
      </div>
    </div>
  );
};

const contentStyles = stylex.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    width: '45%',
    marginRight: spacing['--gf-spacing-x4'],
  },
  media: {
    width: '55%',
  },
  mediaImg: {
    width: '100%',
  },
  title: {
    color: colors['--gf-colors-text-max-contrast'],
  },
  description: {
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-light'],
  },
  list: {
    listStyle: 'none',
    marginTop: spacing['--gf-spacing-x4'],
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x2'],
    marginLeft: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    color: colors['--gf-colors-text-primary'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
  },
  icon: {
    color: colors['--gf-colors-success-main'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  link: {
    marginLeft: spacing['--gf-spacing-x2'],
  },
  caption: {
    fontWeight: typography['--gf-typography-font-weight-light'],
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
});

export const UpgradeContentVertical = ({
  featureName,
  description,
  featureUrl,
  image,
}: Omit<UpgradeContentProps, 'listItems' | 'caption'>) => {
  return (
    <div {...stylex.props(verticalStyles.container)}>
      <h3 {...stylex.props(verticalStyles.title)}>
        <Trans i18nKey="upgrade-box.get-started">Get started with {{ featureName }}</Trans>
      </h3>
      {description && <h6 {...stylex.props(verticalStyles.description)}>{description}</h6>}
      <LinkButton fill={'text'} href={featureUrl} target="_blank" rel="noreferrer noopener">
        <Trans i18nKey="upgrade-box.learn-more">Learn more</Trans>
      </LinkButton>
      <div {...stylex.props(verticalStyles.media)}>
        <img {...stylex.props(verticalStyles.mediaImg)} src={getImgUrl(image)} alt={'Feature screenshot'} />
      </div>
    </div>
  );
};

const verticalStyles = stylex.create({
  container: {
    overflow: 'auto',
    height: '100%',
  },
  title: {
    color: colors['--gf-colors-text-max-contrast'],
  },
  description: {
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-light'],
  },
  media: {
    width: '100%',
    marginTop: spacing['--gf-spacing-x2'],
  },
  mediaImg: {
    width: '100%',
  },
});

const getImgUrl = (urlOrId: string) => {
  if (urlOrId.startsWith('http')) {
    return urlOrId;
  }

  return '/public/build/img/enterprise/highlights/' + urlOrId;
};
