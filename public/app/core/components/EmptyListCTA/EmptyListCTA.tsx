import * as stylex from '@stylexjs/stylex';
import { type MouseEvent } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans } from '@grafana/i18n';
import { Alert, Button, CallToActionCard, Icon, type IconName, LinkButton } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { emptyListCTAStyles } from './EmptyListCTA.stylex';

export interface Props {
  title: string;
  buttonIcon: IconName;
  buttonLink?: string;
  buttonTitle: string;
  buttonDisabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  proTip?: string;
  proTipLink?: string;
  proTipLinkTitle?: string;
  proTipTarget?: string;
  infoBox?: { __html: string };
  infoBoxTitle?: string;
}

const EmptyListCTA = ({
  title,
  buttonIcon,
  buttonLink,
  buttonTitle,
  buttonDisabled,
  onClick,
  proTip,
  proTipLink,
  proTipLinkTitle,
  proTipTarget,
  infoBox,
  infoBoxTitle,
}: Props) => {
  const footer = () => {
    return (
      <>
        {proTip ? (
          <span key="proTipFooter">
            <Icon name="rocket" />
            <Trans i18nKey="empty-list-cta.pro-tip">ProTip: {{ proTip }}</Trans>
            {proTipLink && (
              <a href={proTipLink} target={proTipTarget} className="text-link">
                {proTipLinkTitle}
              </a>
            )}
          </span>
        ) : (
          ''
        )}
        {infoBox ? (
          <Alert
            severity="info"
            title={infoBoxTitle ?? ''}
            {...mergeStylexClassName(stylex.props(emptyListCTAStyles.infoBox), undefined)}
          >
            <div dangerouslySetInnerHTML={infoBox} />
          </Alert>
        ) : (
          ''
        )}
      </>
    );
  };

  const hasFooter = Boolean(footer());

  const ButtonEl = buttonLink ? LinkButton : Button;
  const ctaElement = (
    <ButtonEl
      size="lg"
      onClick={onClick}
      href={buttonLink}
      icon={buttonIcon}
      {...(hasFooter
        ? {}
        : mergeStylexClassName(stylex.props(emptyListCTAStyles.ctaElement), undefined))}
      data-testid={selectors.components.CallToActionCard.buttonV2(buttonTitle)}
      disabled={buttonDisabled}
    >
      {buttonTitle}
    </ButtonEl>
  );

  return (
    <CallToActionCard
      {...mergeStylexClassName(stylex.props(emptyListCTAStyles.cta), undefined)}
      message={title}
      footer={footer()}
      callToActionElement={ctaElement}
    />
  );
};

export default EmptyListCTA;
