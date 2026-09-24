import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { TextLink, useTheme2 } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing, v1 } from '@grafana/ui/stylex/tokens.stylex';

import { type Card } from '../types';

import { docsLinkMarker } from './markers.stylex';
import { cardBorderStyle, cardStyles } from './sharedStyles';
import './DocsCard.css';

interface Props {
  card: Card;
}

export const DocsCard = ({ card }: Props) => {
  const theme = useTheme2();
  const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary, 0.03);

  return (
    <div {...stylex.props(cardStyles.card, cardBorderStyle(theme.isDark, card.done), styles.card)}>
      <div {...stylex.props(cardStyles.content, styles.content(hoverBackground))}>
        <a
          href={`${card.href}?utm_source=grafana_gettingstarted`}
          {...stylex.props(styles.url, docsLinkMarker)}
          onClick={() => reportInteraction('grafana_getting_started_docs', { title: card.title, link: card.href })}
        >
          <div {...stylex.props(styles.heading, card.done ? styles.headingComplete : styles.headingIncomplete)}>
            {card.done ? t('gettingstarted.docs-card.complete', 'complete') : card.heading}
          </div>
          <h4 {...stylex.props(styles.title)}>{card.title}</h4>
        </a>
      </div>
      <div className="gf-docs-card-learn-url">
        <TextLink
          href={`${card.learnHref}?utm_source=grafana_gettingstarted`}
          external
          inline={false}
          onClick={() => reportInteraction('grafana_getting_started_docs', { title: card.title, link: card.learnHref })}
        >
          <Trans i18nKey="gettingstarted.docs-card.learn-how">Learn how in the docs</Trans>
        </TextLink>
      </div>
    </div>
  );
};

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: {
      default: '230px',
      [bp.mdDown]: '192px',
    },
  },
  content: (hoverBackground: string) => ({
    flexGrow: 1,
    backgroundColor: {
      default: null,
      [stylex.when.descendant(':hover', docsLinkMarker)]: hoverBackground,
    },
  }),
  heading: {
    textTransform: 'uppercase',
    marginBottom: spacing['--gf-spacing-x2'],
  },
  headingComplete: {
    color: v1['--gf-v1-palette-blue95'],
  },
  headingIncomplete: {
    color: '#FFB357',
  },
  title: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  url: {
    display: 'inline-block',
    height: '100%',
  },
});
