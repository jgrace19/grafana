import * as stylex from '@stylexjs/stylex';
import { stepStyles } from './Step.stylex';

import { type SetupStep } from '../types';

import { DocsCard } from './DocsCard';
import { TutorialCard } from './TutorialCard';

interface Props {
  step: SetupStep;
}

export const Step = ({ step }: Props) => {

  return (
    <div {...stylex.props(stepStyles.setup)}>
      <div {...stylex.props(stepStyles.info)}>
        <h2 {...stylex.props(stepStyles.title)}>{step.title}</h2>
        <p>{step.info}</p>
      </div>
      <div {...stylex.props(stepStyles.cards)}>
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

;
