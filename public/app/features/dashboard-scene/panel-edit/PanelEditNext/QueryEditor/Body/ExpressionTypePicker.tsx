import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { expressionTypePickerStyles } from './ExpressionTypePicker.stylex';

import { reportInteraction } from '@grafana/runtime';
import {Card, Text, useTheme2} from '@grafana/ui';
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
    <div {...stylex.props(expressionTypePickerStyles.grid)}>
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
              <img {...stylex.props(expressionTypePickerStyles.image)} src={imageUrl} alt={label} />
            </Card.Description>
          </Card>
        );
      })}
    </div>
  );
}

