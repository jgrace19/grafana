import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { TextLink } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

const helpOptions = [
  { value: 0, label: 'Documentation', href: 'https://grafana.com/docs/grafana/latest' },
  { value: 1, label: 'Tutorials', href: 'https://grafana.com/tutorials' },
  { value: 2, label: 'Community', href: 'https://community.grafana.com' },
  { value: 3, label: 'Public Slack', href: 'http://slack.grafana.com' },
];

export const WelcomeBanner = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.title)}>
        <Trans i18nKey="welcome.welcome-banner.welcome-to-grafana">Welcome to Grafana</Trans>
      </h1>
      <div {...stylex.props(styles.help)}>
        <h2 {...stylex.props(styles.helpText)}>
          <Trans i18nKey="welcome.welcome-banner.need-help">Need help?</Trans>
        </h2>
        <div {...stylex.props(styles.helpLinks)}>
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

const styles = stylex.create({
  container: {
    display: 'flex',
    backgroundSize: 'cover',
    height: '100%',
    alignItems: {
      default: 'center',
      [bp.lgDown]: 'flex-start',
    },
    justifyContent: {
      default: 'space-between',
      [bp.lgDown]: 'center',
    },
    paddingTop: {
      default: spacing['--gf-spacing-x0'],
      [bp.smDown]: spacing['--gf-spacing-x0'],
    },
    paddingRight: {
      default: spacing['--gf-spacing-x3'],
      [bp.smDown]: spacing['--gf-spacing-x1'],
    },
    paddingBottom: {
      default: spacing['--gf-spacing-x0'],
      [bp.smDown]: spacing['--gf-spacing-x0'],
    },
    paddingLeft: {
      default: spacing['--gf-spacing-x3'],
      [bp.smDown]: spacing['--gf-spacing-x1'],
    },
    backgroundPosition: {
      default: null,
      [bp.lgDown]: '0px',
    },
    flexDirection: {
      default: null,
      [bp.lgDown]: 'column',
    },
  },
  title: {
    marginBottom: {
      default: 0,
      [bp.lgDown]: spacing['--gf-spacing-x1'],
    },
    fontSize: {
      default: null,
      [bp.mdDown]: typography['--gf-typography-h2-font-size'],
      [bp.smDown]: typography['--gf-typography-h3-font-size'],
    },
  },
  help: {
    display: 'flex',
    alignItems: 'baseline',
  },
  helpText: {
    fontFamily: typography['--gf-typography-h3-font-family'],
    fontWeight: typography['--gf-typography-h3-font-weight'],
    lineHeight: typography['--gf-typography-h3-line-height'],
    letterSpacing: typography['--gf-typography-h3-letter-spacing'],
    marginRight: spacing['--gf-spacing-x2'],
    marginBottom: 0,
    fontSize: {
      default: typography['--gf-typography-h3-font-size'],
      [bp.mdDown]: typography['--gf-typography-h4-font-size'],
    },
    display: {
      default: null,
      [bp.smDown]: 'none',
    },
  },
  helpLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: {
      default: spacing['--gf-spacing-x2'],
      [bp.smDown]: spacing['--gf-spacing-x1'],
    },
    textWrap: 'nowrap',
  },
});
