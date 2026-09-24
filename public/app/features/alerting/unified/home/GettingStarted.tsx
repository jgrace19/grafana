import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { gettingStartedStyles } from './GettingStarted.stylex';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Stack, Text, TextLink, useTheme2 } from '@grafana/ui';
import atAGlanceDarkSvg from 'img/alerting/at_a_glance_dark.svg';
import atAGlanceLightSvg from 'img/alerting/at_a_glance_light.svg';

import { TUTORIAL_URL_ALERTING_GET_STARTED } from '../utils/docs';

export default function GettingStarted() {
  const theme = useTheme2();

  const atAGlanceImage = theme.name === 'dark' ? atAGlanceDarkSvg : atAGlanceLightSvg;

  return (
    <div {...stylex.props(gettingStartedStyles.grid)}>
      <ContentBox>
        <Stack direction="column" gap={1}>
          <Text element="h3">
            <Trans i18nKey="alerting.getting-started.how-it-works">How it works</Trans>
          </Text>
          <ul {...stylex.props(gettingStartedStyles.list)}>
            <li>
              <Trans i18nKey="alerting.getting-started.periodically-queries-data-sources">
                Grafana alerting periodically queries data sources and evaluates the condition defined in the alert rule
              </Trans>
            </li>
            <li>
              <Trans i18nKey="alerting.getting-started.condition-breached-alert-instance-fires">
                If the condition is breached, an alert instance fires
              </Trans>
            </li>
            <li>
              <Trans i18nKey="alerting.getting-started.firing-instances-routed-notification-policies">
                Firing instances are routed to notification policies based on matching labels
              </Trans>
            </li>
            <li>
              <Trans i18nKey="alerting.getting-started.notification-policies-contact-points">
                Notifications are sent out to the contact points specified in the notification policy
              </Trans>
            </li>
          </ul>
          <div {...stylex.props(gettingStartedStyles.svgContainer)}>
            <Stack justifyContent={'center'}>
              <SVG src={atAGlanceImage} width={undefined} height={undefined} />
            </Stack>
          </div>
        </Stack>
      </ContentBox>
      <ContentBox>
        <Stack direction="column" gap={1}>
          <Text element="h3">
            <Trans i18nKey="alerting.getting-started.get-started">Get started</Trans>
          </Text>
          <ul {...stylex.props(gettingStartedStyles.list)}>
            <li>
              <Trans i18nKey="alerting.getting-started.create-alert-rule">
                <Text weight="bold">Create an alert rule</Text> to query a data source and evaluate the condition
                defined in the alert rule
              </Trans>
            </li>
            <li>
              <Trans i18nKey="alerting.getting-started.route-alert-notifications">
                <Text weight="bold">Route alert notifications</Text> either directly to a contact point or through
                notification policies for more flexibility
              </Trans>
            </li>
            <li>
              <Trans i18nKey="alerting.getting-started.monitor-alert-rules">
                <Text weight="bold">Monitor</Text> your alert rules using dashboards and visualizations
              </Trans>
            </li>
          </ul>
          <p>
            <Trans i18nKey="alerting.getting-stared.learn-more">
              For a hands-on introduction, refer to our{' '}
              <TextLink href={TUTORIAL_URL_ALERTING_GET_STARTED} inline={true} external>
                tutorial to get started with Grafana Alerting
              </TextLink>
            </Trans>
          </p>
        </Stack>
      </ContentBox>
    </div>
  );
}


export function WelcomeHeader({ className }: { className?: string }) {

  return (
    <Stack gap={2} direction="column">
      <ContentBox {...mergeStylexClassName(stylex.props(gettingStartedStyles.ctaContainer), className)}>
        {config.featureToggles.alertingTriage && (
          <>
            <WelcomeCTABox
              title={t('alerting.welcome-header.title-alert-activity', 'Alert activity')}
              description={t(
                'alerting.welcome-header.description-alert-activity',
                'See what is currently alerting and explore historical data to investigate current or past issues.'
              )}
              href="/alerting/alerts"
              hrefText={t('alerting.welcome-header.href-text-alert-activity', 'View alert activity')}
            />
            <div {...stylex.props(gettingStartedStyles.separator)} />
          </>
        )}
        <WelcomeCTABox
          title={t('alerting.welcome-header.title-alert-rules', 'Alert rules')}
          description={t(
            'alerting.welcome-header.description-alert-rules',
            'Define the condition that must be met before an alert rule fires'
          )}
          href="/alerting/list"
          hrefText="Manage alert rules"
        />
        <div {...stylex.props(gettingStartedStyles.separator)} />
        <WelcomeCTABox
          title={t('alerting.welcome-header.title-contact-points', 'Contact points')}
          description={t(
            'alerting.welcome-header.description-configure-receives-notifications',
            'Configure who receives notifications and how they are sent'
          )}
          href="/alerting/notifications"
          hrefText="Manage contact points"
        />
        <div {...stylex.props(gettingStartedStyles.separator)} />
        <WelcomeCTABox
          title={t('alerting.welcome-header.title-notification-policies', 'Notification policies')}
          description={t(
            'alerting.welcome-header.description-configure-firing-alert-instances-routed-contact',
            'Configure how firing alert instances are routed to contact points'
          )}
          href="/alerting/routes"
          hrefText="Manage notification policies"
        />
      </ContentBox>
    </Stack>
  );
}


interface WelcomeCTABoxProps {
  title: string;
  description: string;
  href: string;
  hrefText: string;
}

function WelcomeCTABox({ title, description, href, hrefText }: WelcomeCTABoxProps) {

  return (
    <div {...stylex.props(gettingStartedStyles.container)}>
      <Text element="h2" variant="h3">
        {title}
      </Text>
      <div {...stylex.props(gettingStartedStyles.desc)}>{description}</div>
      <div {...stylex.props(gettingStartedStyles.actionRow)}>
        <TextLink href={href}>{hrefText}</TextLink>
      </div>
    </div>
  );
}

;

function ContentBox({ children, className }: React.PropsWithChildren<{ className?: string }>) {

  return <div {...mergeStylexClassName(stylex.props(gettingStartedStyles.box), className)}>{children}</div>;
}

;
