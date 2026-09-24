import * as stylex from '@stylexjs/stylex';

import { type SelectableValue } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Card, Text, useTheme2 } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { type ExpressionQueryType, expressionTypes } from 'app/features/expressions/types';

import { EXPRESSION_IMAGE_MAP } from '../../constants';
import { useQueryEditorUIContext } from '../QueryEditorContext';

function hasDefinedValue(
  item: SelectableValue<ExpressionQueryType>
): item is SelectableValue<ExpressionQueryType> & { value: ExpressionQueryType } {
  return item.value != null;
}

export function ExpressionTypePicker() {
  const theme = useTheme2();
  const { finalizePendingExpression } = useQueryEditorUIContext();

  return (
    <div {...stylex.props(styles.grid)}>
      {expressionTypes.filter(hasDefinedValue).map((item) => {
        const image = EXPRESSION_IMAGE_MAP[item.value];
        const imageUrl = theme.isDark ? image.dark : image.light;
        const label = item.label ?? '';

        return (
          <Card
            key={item.value}
            onClick={() => {
              reportInteraction('dashboards_expression_interaction', {
                action: 'add_expression',
                expression_type: item.value,
                context: 'panel_query_section',
              });
              finalizePendingExpression(item.value);
            }}
            noMargin
          >
            <Card.Heading>{label}</Card.Heading>
            <Card.Description>
              <Text variant="bodySmall">{item.description ?? ''}</Text>
              <img {...stylex.props(styles.image)} src={imageUrl} alt={label} />
            </Card.Description>
          </Card>
        );
      })}
    </div>
  );
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gap: spacing['--gf-spacing-x1'],
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  },
  image: {
    display: 'block',
    maxWidth: '100%',
    marginTop: spacing['--gf-spacing-x2'],
  },
});
