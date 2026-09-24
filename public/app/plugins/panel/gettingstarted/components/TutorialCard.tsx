import * as stylex from '@stylexjs/stylex';
import { type MouseEvent } from 'react';

import { store } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { useTheme2 } from '@grafana/ui';

import { getCardAccentStyle, getCardStyleProps } from '../sharedCardStyles';
import { type TutorialCardType } from '../types';

import { sharedStyles } from './sharedStyles.stylex';
import { tutorialCardStyles } from './TutorialCard.stylex';

interface Props {
  card: TutorialCardType;
}

export const TutorialCard = ({ card }: Props) => {
  const theme = useTheme2();
  const cardStyleProps = getCardStyleProps(theme, card.done);

  return (
    <a
      {...stylex.props(tutorialCardStyles.card)}
      style={cardStyleProps}
      target="_blank"
      rel="noreferrer"
      href={`${card.href}?utm_source=grafana_gettingstarted`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => handleTutorialClick(event, card)}
    >
      <span style={getCardAccentStyle(theme, card.done)} aria-hidden />
      <div {...stylex.props(sharedStyles.cardContent)}>
        <div {...stylex.props(tutorialCardStyles.type)}>{card.type}</div>
        <div {...stylex.props(tutorialCardStyles.heading)}>
          {card.done ? t('gettingstarted.tutorial-card.complete', 'complete') : card.heading}
        </div>
        <h4 {...stylex.props(tutorialCardStyles.cardTitle)}>{card.title}</h4>
        <div {...stylex.props(tutorialCardStyles.info)}>{card.info}</div>
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
