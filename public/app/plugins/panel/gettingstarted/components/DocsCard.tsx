import * as stylex from '@stylexjs/stylex';

import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { TextLink, useTheme2 } from '@grafana/ui';

import { getCardAccentStyle, getCardStyleProps } from '../sharedCardStyles';
import { type Card } from '../types';

import { sharedStyles } from './sharedStyles.stylex';
import { docsCardStyles } from './DocsCard.stylex';

interface Props {
  card: Card;
}

export const DocsCard = ({ card }: Props) => {
  const theme = useTheme2();

  return (
    <div {...stylex.props(docsCardStyles.card)} style={getCardStyleProps(theme, card.done)}>
      <span style={getCardAccentStyle(theme, card.done)} aria-hidden />
      <div {...stylex.props(docsCardStyles.content, sharedStyles.cardContent)}>
        <a
          href={`${card.href}?utm_source=grafana_gettingstarted`}
          {...stylex.props(docsCardStyles.url)}
          onClick={() => reportInteraction('grafana_getting_started_docs', { title: card.title, link: card.href })}
        >
          <div
            style={{
              textTransform: 'uppercase',
              color: card.done ? theme.visualization.getColorByName('blue') : '#FFB357',
              marginBottom: theme.spacing(2),
            }}
          >
            {card.done ? t('gettingstarted.docs-card.complete', 'complete') : card.heading}
          </div>
          <h4 {...stylex.props(docsCardStyles.title)}>{card.title}</h4>
        </a>
      </div>
      <div>
        <TextLink
          href={`${card.learnHref}?utm_source=grafana_gettingstarted`}
          external
          inline={false}
          className={stylex.props(docsCardStyles.learnUrlLink).className}
          onClick={() => reportInteraction('grafana_getting_started_docs', { title: card.title, link: card.learnHref })}
        >
          <Trans i18nKey="gettingstarted.docs-card.learn-how">Learn how in the docs</Trans>
        </TextLink>
      </div>
    </div>
  );
};
