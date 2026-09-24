import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useCallback } from 'react';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Checkbox, Icon } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getNormalizedFieldName } from '../panel/processing';

import { type FieldWithStats } from './FieldSelector';
import './FieldSelector.css';

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
      <div {...stylex.props(styles.contentWrap)}>
        <Checkbox
          className="gf-logs-field-checkbox"
          label={getNormalizedFieldName(field.name)}
          onChange={handleChange}
          checked={active}
        />
        {showCount && (
          <button {...stylex.props(styles.labelCount)} onClick={handleChange}>
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
          xstyle={styles.dragIcon}
        />
      )}
    </>
  );
}

// theme.typography.pxToRem(11), derived from the 12px bodySmall size so it follows the theme's font sizes.
const smallFontSize = `calc(${typography['--gf-typography-body-small-font-size']} * 11 / 12)`;

const styles = stylex.create({
  dragIcon: {
    marginLeft: spacing['--gf-spacing-x1'],
    opacity: 0.4,
  },
  labelCount: {
    marginLeft: spacing['--gf-spacing-x0-5'],
    marginRight: spacing['--gf-spacing-x0-5'],
    appearance: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    fontSize: smallFontSize,
    opacity: 0.6,
  },
  contentWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
