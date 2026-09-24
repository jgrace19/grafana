import * as stylex from '@stylexjs/stylex';
import { welcomeStyles } from './Welcome.stylex';

import { Trans } from '@grafana/i18n';
import { TextLink } from '@grafana/ui';

const helpOptions = [
  { value: 0, label: 'Documentation', href: 'https://grafana.com/docs/grafana/latest' },
  { value: 1, label: 'Tutorials', href: 'https://grafana.com/tutorials' },
  { value: 2, label: 'Community', href: 'https://community.grafana.com' },
  { value: 3, label: 'Public Slack', href: 'http://slack.grafana.com' },
];

export const WelcomeBanner = () => {

  return (
    <div {...stylex.props(welcomeStyles.container)}>
      <h1 {...stylex.props(welcomeStyles.title)}>
        <Trans i18nKey="welcome.welcome-banner.welcome-to-grafana">Welcome to Grafana</Trans>
      </h1>
      <div {...stylex.props(welcomeStyles.help)}>
        <h2 {...stylex.props(welcomeStyles.helpText)}>
          <Trans i18nKey="welcome.welcome-banner.need-help">Need help?</Trans>
        </h2>
        <div {...stylex.props(welcomeStyles.helpLinks)}>
          {helpOptions.map((option, index) => (
            <TextLink
              key={`${option.label}-${index}`}
              href={`${option.href}?utm_source=grafana_gettingstarted`}
              external
              inline={false}
            >
              {option.label}
            </TextLink>
          ))}
        </div>
      </div>
    </div>
  );
};

;
