// eslint-disable-next-line no-restricted-imports -- stylex: pending Card migration
import { css, cx } from '@emotion/css';
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
  const cardStyles = cx({
    [pendingEmotionStyles.wrapper]: true,
    [pendingEmotionStyles.disabled]: disabled,
  });

  return (
    <Card noMargin className={cardStyles} isSelected={selected} onClick={() => onClick(value)} disabled={disabled}>
      <Card.Figure>
        <img src={image} alt="" />
      </Card.Figure>
      <Card.Heading>{name}</Card.Heading>
      <Card.Description>{description}</Card.Description>
    </Card>
  );
};

// stylex: pending Card migration
const pendingEmotionStyles = {
  wrapper: css({
    width: '380px',
    cursor: 'pointer',
    userSelect: 'none',
  }),
  disabled: css({
    opacity: '0.5',
  }),
};

export { RuleType };
