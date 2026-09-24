import * as stylex from '@stylexjs/stylex';
import cx from 'classnames';

import {
  type DataFrame,
  type TransformerRegistryItem,
  TransformationApplicabilityLevels,
  standardTransformersRegistry,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Badge, Card, IconButton, Stack, Text, useTheme2 } from '@grafana/ui';
import { PluginStateInfo } from 'app/features/plugins/components/PluginStateInfo';

import { cardClassNames, cardStyles } from './cardStyles';

export interface TransformationCardProps {
  data?: DataFrame[];
  fullWidth?: boolean;
  onClick: (id: string) => void;
  showIllustrations?: boolean;
  showPluginState?: boolean;
  showTags?: boolean;
  transform: TransformerRegistryItem;
}

export function TransformationCard({
  data = [],
  fullWidth = false,
  onClick,
  showIllustrations,
  showPluginState = true,
  showTags = true,
  transform,
}: TransformationCardProps) {
  const theme = useTheme2();

  // Check to see if the transform is applicable to the given data
  let applicabilityScore = TransformationApplicabilityLevels.Applicable;
  if (data.length > 0 && transform.transformation.isApplicable !== undefined) {
    applicabilityScore = transform.transformation.isApplicable(data);
  }
  const isApplicable = applicabilityScore > 0;

  let applicabilityDescription = null;
  if (data.length > 0 && transform.transformation.isApplicableDescription !== undefined) {
    if (typeof transform.transformation.isApplicableDescription === 'function') {
      applicabilityDescription = transform.transformation.isApplicableDescription(data);
    } else {
      applicabilityDescription = transform.transformation.isApplicableDescription;
    }
  }

  const cardClasses = cx(
    fullWidth ? cardClassNames.baseCardFullWidth : cardClassNames.baseCard,
    !isApplicable && cardClassNames.cardDisabled
  );
  const imageUrl = theme.isDark ? transform.imageDark : transform.imageLight;
  const description = standardTransformersRegistry.getIfExists(transform.id)?.description;

  return (
    <Card
      className={cardClasses}
      data-testid={selectors.components.TransformTab.newTransform(transform.name)}
      onClick={() => onClick(transform.id)}
      noMargin
    >
      <Card.Heading>
        <Stack alignItems="center" justifyContent="space-between">
          {transform.name}
          {showPluginState && <PluginStateInfo state={transform.state} />}
        </Stack>
        {showTags && transform.tags && transform.tags.size > 0 && (
          <div {...stylex.props(cardStyles.tagsWrapper)}>
            {Array.from(transform.tags).map((tag) => (
              <Badge color="darkgrey" icon="tag-alt" key={tag} text={tag} />
            ))}
          </div>
        )}
      </Card.Heading>
      <Card.Description>
        <Text variant="bodySmall">{description || ''}</Text>
        {showIllustrations && imageUrl && (
          <img
            {...stylex.props(cardStyles.image, !isApplicable && cardStyles.imageDisabled)}
            src={imageUrl}
            alt={transform.name}
          />
        )}
        {!isApplicable && applicabilityDescription !== null && (
          <IconButton
            className="gf-transformation-card-info-button"
            name="info-circle"
            tooltip={applicabilityDescription}
          />
        )}
      </Card.Description>
    </Card>
  );
}
