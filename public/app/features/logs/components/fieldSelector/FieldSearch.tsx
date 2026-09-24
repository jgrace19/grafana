import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Field, IconButton, Input } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import './FieldSelector.css';

interface Props {
  collapse(): void;
  onChange(e?: React.FormEvent<HTMLInputElement>): void;
  value: string;
}

export function FieldSearch({ collapse, onChange, value }: Props) {
  return (
    <>
      <IconButton
        className="gf-logs-field-search-collapse"
        xstyle={styles.iconExpanded}
        onClick={collapse}
        name="arrow-from-right"
        tooltip={t('logs.field-selector.collapse', 'Collapse sidebar')}
        size="sm"
      />
      {/* A wrapper, because Field sets its own (Emotion) margin, which beats a StyleX class on it. */}
      <div {...stylex.props(styles.searchWrap)}>
        <Field noMargin>
          <Input
            value={value}
            type="text"
            placeholder={t('logs.field-selector.placeholder-search-fields-by-name', 'Search fields by name')}
            onChange={onChange}
            suffix={
              value ? (
                <IconButton
                  name="times"
                  aria-label={t('logs.field-selector.clear-button', 'Clear')}
                  onClick={() => onChange()}
                />
              ) : undefined
            }
          />
        </Field>
      </div>
    </>
  );
}

const styles = stylex.create({
  iconExpanded: {
    position: 'absolute',
    right: `calc(${spacing['--gf-spacing-grid-size']} * 0.2)`,
    top: spacing['--gf-spacing-x1'],
  },
  searchWrap: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.4)`,
    paddingRight: 0,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.4)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.4)`,
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
