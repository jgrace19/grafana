import * as stylex from '@stylexjs/stylex';

import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing, v1 } from '@grafana/ui/stylex/tokens.stylex';

import { type SetupStep } from '../types';

import { DocsCard } from './DocsCard';
import { TutorialCard } from './TutorialCard';

interface Props {
  step: SetupStep;
}

export const Step = ({ step }: Props) => {
  return (
    <div {...stylex.props(styles.setup)}>
      <div {...stylex.props(styles.info)}>
        <h2 {...stylex.props(styles.title)}>{step.title}</h2>
        <p>{step.info}</p>
      </div>
      <div {...stylex.props(styles.cards)}>
        {step.cards.map((card, index) => {
          const key = `${card.title}-${index}`;
          if (card.type === 'tutorial') {
            return <TutorialCard key={key} card={card} />;
          }
          return <DocsCard key={key} card={card} />;
        })}
      </div>
    </div>
  );
};

const styles = stylex.create({
  setup: {
    display: 'flex',
    width: '95%',
  },
  info: {
    width: '172px',
    marginRight: {
      default: '5%',
      [bp.xxlDown]: spacing['--gf-spacing-x4'],
    },
    display: {
      default: null,
      [bp.smDown]: 'none',
    },
  },
  title: {
    color: v1['--gf-v1-palette-blue95'],
  },
  cards: {
    overflowX: 'auto',
    overflowY: 'hidden',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
});
