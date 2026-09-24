import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';

import { FIELD_NAME_FACET_KEY } from '@grafana/data';
import { Trans } from '@grafana/i18n';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Checkbox } from '../Forms/Checkbox';
import { Icon } from '../Icon/Icon';

export interface FacetedLabelsFilterProps {
  /** Map of label keys to their sorted unique values, from extractFacetedLabels */
  labels: Record<string, string[]>;
  /** Currently selected label values, keyed by label key */
  selected: Record<string, string[]>;
  /** Called when the selection changes */
  onChange: (selected: Record<string, string[]>) => void;
  /** When true the filter is dimmed to indicate the legend has taken precedence */
  dimmed?: boolean;
}

export function FacetedLabelsFilter({ labels, selected, onChange, dimmed }: FacetedLabelsFilterProps) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const labelKeys = Object.keys(labels);

  const toggleExpanded = useCallback((key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleValue = useCallback(
    (key: string, value: string) => {
      const current = selected[key] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

      onChange({ ...selected, [key]: next });
    },
    [selected, onChange]
  );

  const toggleAllForKey = useCallback(
    (key: string) => {
      const values = labels[key];
      if (!values) {
        return;
      }
      const current = selected[key] ?? [];
      const allSelected = current.length === values.length;
      onChange({ ...selected, [key]: allSelected ? [] : [...values] });
    },
    [labels, selected, onChange]
  );

  const seriesValues = labels[FIELD_NAME_FACET_KEY];
  const realLabelKeys = labelKeys.filter((key) => key !== FIELD_NAME_FACET_KEY);

  if (!seriesValues && realLabelKeys.length === 0) {
    return null;
  }

  const renderCheckboxList = (key: string, values: string[], listStyle: stylex.StyleXStyles) => {
    const selectedValues = selected[key] ?? [];
    return (
      <div {...stylex.props(listStyle)}>
        {values.map((value) => (
          <Checkbox
            key={value}
            label={value}
            value={selectedValues.includes(value)}
            onChange={() => toggleValue(key, value)}
            className={stylex.props(styles.checkbox).className}
          />
        ))}
        <button type="button" {...stylex.props(styles.toggleAll)} onClick={() => toggleAllForKey(key)}>
          {selectedValues.length === values.length ? (
            <Trans i18nKey="grafana-ui.viz-legend.faceted-deselect-all">Deselect all</Trans>
          ) : (
            <Trans i18nKey="grafana-ui.viz-legend.faceted-select-all">Select all</Trans>
          )}
        </button>
      </div>
    );
  };

  return (
    <div {...stylex.props(styles.container, dimmed && styles.dimmed)} data-testid="faceted-labels-filter">
      {seriesValues && (
        <div {...stylex.props(styles.section)}>
          <span {...stylex.props(styles.sectionLabel)}>
            <Trans i18nKey="grafana-ui.viz-legend.faceted-by-name">By name</Trans>
          </span>
          {renderCheckboxList(FIELD_NAME_FACET_KEY, seriesValues, styles.checkboxList)}
        </div>
      )}

      {realLabelKeys.length > 0 && (
        <div {...stylex.props(styles.section)}>
          <span {...stylex.props(styles.sectionLabel)}>
            <Trans i18nKey="grafana-ui.viz-legend.faceted-by-labels">By labels</Trans>
          </span>
          {realLabelKeys.map((key) => {
            const selectedValues = selected[key] ?? [];
            const isExpanded = expandedKeys[key] ?? false;
            return (
              <div key={key} {...stylex.props(styles.labelGroup)}>
                <button type="button" {...stylex.props(styles.labelKey)} onClick={() => toggleExpanded(key)}>
                  <Icon name={isExpanded ? 'angle-down' : 'angle-right'} size="sm" />
                  <span {...stylex.props(styles.keyName)}>{key}</span>
                  {selectedValues.length > 0 && <span {...stylex.props(styles.count)}>{selectedValues.length}</span>}
                </button>
                {isExpanded && renderCheckboxList(key, labels[key], styles.checkboxListIndented)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

FacetedLabelsFilter.displayName = 'FacetedLabelsFilter';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    minWidth: '150px',
    paddingTop: spacing['--gf-spacing-x1-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    gap: spacing['--gf-spacing-x1'],
  },
  dimmed: {
    opacity: 0.5,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionLabel: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-secondary'],
    marginBottom: spacing['--gf-spacing-x0-25'],
  },
  toggleAll: {
    all: 'unset',
    cursor: 'pointer',
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-link'],
    marginTop: spacing['--gf-spacing-x0-25'],
    textDecoration: { default: null, ':hover': 'underline' },
  },
  labelGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  labelKey: {
    all: 'unset',
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    cursor: 'pointer',
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: 0,
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: { default: colors['--gf-colors-text-primary'], ':hover': colors['--gf-colors-text-max-contrast'] },
  },
  keyName: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
  count: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-primary-text'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x0-25'],
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  checkboxListIndented: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing['--gf-spacing-x0-25'],
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x2-5'],
  },
  checkbox: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
});
