import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { Card } from '@grafana/ui';

import { type RuleFormType } from '../../../types/rule-form';

interface Props extends SharedProps {
  image: string;
  name: string;
  description: ReactNode;
  value: RuleFormType;
}

// these properties are shared between all Rule Types
export interface SharedProps {
  selected?: boolean;
  disabled?: boolean;
  onClick: (value: RuleFormType) => void;
}

const RuleType = (props: Props) => {
  const { name, description, image, selected = false, value, onClick, disabled = false } = props;

  return (
    <Card
      noMargin
      xstyle={[styles.card, disabled && styles.disabledCard]}
      isSelected={selected}
      onClick={() => onClick(value)}
      disabled={disabled}
    >
      <Card.Figure>
        <img src={image} alt="" />
      </Card.Figure>
      <Card.Heading>{name}</Card.Heading>
      <Card.Description>{description}</Card.Description>
    </Card>
  );
};

const styles = stylex.create({
  card: {
    width: '380px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  disabledCard: {
    opacity: 0.5,
  },
});

export { RuleType };
