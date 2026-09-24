import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { fieldStyles } from './Field.stylex';
import * as React from 'react';
import { useCallback } from 'react';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Checkbox, Icon } from '@grafana/ui';

import { getNormalizedFieldName } from '../panel/processing';

import { type FieldWithStats } from './FieldSelector';

interface Props {
  active?: boolean;
  field: FieldWithStats;
  toggle(key: string): void;
  draggable?: boolean;
  showCount?: boolean;
}

export function Field({
  active = false,
  draggable = false,
  field,
  toggle,
  showCount = false,
}: Props): React.JSX.Element | undefined {

  const handleChange = useCallback(() => {
    reportInteraction('logs_field_selector_toggle_fields_clicked', {
      active,
    });
    toggle(field.name);
  }, [active, field.name, toggle]);

  return (
    <>
      <div {...stylex.props(fieldStyles.contentWrap)}>
        <Checkbox
          {...stylex.props(fieldStyles.checkboxLabel)}
          label={getNormalizedFieldName(field.name)}
          onChange={handleChange}
          checked={active}
        />
        {showCount && (
          <button {...stylex.props(fieldStyles.labelCount)} onClick={handleChange}>
            {field.stats.percentOfLinesWithLabel}%
          </button>
        )}
      </div>
      {draggable && (
        <Icon
          aria-label={t('logs.field-selector.aria-label-drag-and-drop-icon', 'Drag and drop icon')}
          title={t('logs.field-selector.title-drag-and-drop-to-reorder', 'Drag and drop to reorder')}
          name="draggabledots"
          size="lg"
          {...stylex.props(fieldStyles.dragIcon)}
        />
      )}
    </>
  );
}

