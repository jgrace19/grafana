import * as stylex from '@stylexjs/stylex';
import { type MouseEvent } from 'react';

import { store } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { useTheme2 } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type TutorialCardType } from '../types';

import { cardBorderStyle, cardStyles } from './sharedStyles';

interface Props {
  card: TutorialCardType;
}

export const TutorialCard = ({ card }: Props) => {
  const theme = useTheme2();
  const hoverBackground = theme.colors.emphasize(theme.colors.background.secondary, 0.03);

  return (
    <a
      {...stylex.props(
        cardStyles.card,
        cardBorderStyle(theme.isDark, card.done),
        styles.card,
        styles.hoverBackground(hoverBackground)
      )}
      target="_blank"
      rel="noreferrer"
      href={`${card.href}?utm_source=grafana_gettingstarted`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => handleTutorialClick(event, card)}
    >
      <div {...stylex.props(cardStyles.content)}>
        <div {...stylex.props(styles.type)}>{card.type}</div>
        <div {...stylex.props(styles.heading)}>
          {card.done ? t('gettingstarted.tutorial-card.complete', 'complete') : card.heading}
        </div>
        <h4 {...stylex.props(styles.cardTitle)}>{card.title}</h4>
        <div {...stylex.props(styles.info)}>{card.info}</div>
      </div>
    </a>
  );
};

const handleTutorialClick = (event: MouseEvent<HTMLAnchorElement>, card: TutorialCardType) => {
  const isSet = store.get(card.key);
  if (!isSet) {
    store.set(card.key, true);
  }
  reportInteraction('grafana_getting_started_tutorial', { title: card.title });
};

const styles = stylex.create({
  card: {
    width: '460px',
    minWidth: {
      default: '460px',
      [bp.xlDown]: '368px',
      [bp.lgDown]: '272px',
    },
  },
  hoverBackground: (hover: string) => ({
    backgroundColor: {
      default: colors['--gf-colors-background-secondary'],
      ':hover': hover,
    },
  }),
  type: {
    color: colors['--gf-colors-primary-text'],
    textTransform: 'uppercase',
  },
  heading: {
    textTransform: 'uppercase',
    color: colors['--gf-colors-primary-text'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
  cardTitle: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
  info: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
