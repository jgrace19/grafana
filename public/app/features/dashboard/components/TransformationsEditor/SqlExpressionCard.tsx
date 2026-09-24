import * as stylex from '@stylexjs/stylex';

import { Card, Text } from '@grafana/ui';

import { cardOverrides, cardStyles } from './cardStyles';

export interface SqlExpressionCardProps {
  name: string;
  description: string;
  imageUrl?: string;
  onClick: () => void;
  testId?: string;
  fullWidth?: boolean;
}

export function SqlExpressionCard({ name, description, imageUrl, onClick, testId, fullWidth }: SqlExpressionCardProps) {
  return (
    <Card
      className={fullWidth ? cardOverrides.baseCardFullWidth : cardOverrides.baseCard}
      data-testid={testId}
      onClick={onClick}
      noMargin
    >
      <Card.Heading>{name}</Card.Heading>
      <Card.Description>
        <Text variant="bodySmall">{description}</Text>
        {imageUrl && <img {...stylex.props(cardStyles.image)} src={imageUrl} alt={name} />}
      </Card.Description>
    </Card>
  );
}
