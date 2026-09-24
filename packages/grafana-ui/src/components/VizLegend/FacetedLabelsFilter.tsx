import clsx from 'clsx';

import { facetedLabelsFilterStyleProps } from './FacetedLabelsFilter.stylex'

import { useCallback, useState } from 'react';

import { FIELD_NAME_FACET_KEY, } from '@grafana/data';
import { Trans } from '@grafana/i18n';

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

  const renderCheckboxList = (key: string, values: string[], className: string) => {
    const selectedValues = selected[key] ?? [];
    return (
      <div className={className}>
        {values.map((value) => (
          <Checkbox
            key={value}
            label={value}
            value={selectedValues.includes(value)}
            onChange={() => toggleValue(key, value)}
            {...facetedLabelsFilterStyleProps('checkbox')}
          />
        ))}
        <button type="button" {...facetedLabelsFilterStyleProps('toggleAll')} onClick={() => toggleAllForKey(key)}>
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
    <div
      className={clsx(
        facetedLabelsFilterStyleProps('container').className,
        dimmed && facetedLabelsFilterStyleProps('dimmed').className
      )}
      data-testid="faceted-labels-filter"
    >
      {seriesValues && (
        <div {...facetedLabelsFilterStyleProps('section')}>
          <span {...facetedLabelsFilterStyleProps('sectionLabel')}>
            <Trans i18nKey="grafana-ui.viz-legend.faceted-by-name">By name</Trans>
          </span>
          {renderCheckboxList(
            FIELD_NAME_FACET_KEY,
            seriesValues,
            facetedLabelsFilterStyleProps('checkboxList').className ?? ''
          )}
        </div>
      )}

      {realLabelKeys.length > 0 && (
        <div {...facetedLabelsFilterStyleProps('section')}>
          <span {...facetedLabelsFilterStyleProps('sectionLabel')}>
            <Trans i18nKey="grafana-ui.viz-legend.faceted-by-labels">By labels</Trans>
          </span>
          {realLabelKeys.map((key) => {
            const selectedValues = selected[key] ?? [];
            const isExpanded = expandedKeys[key] ?? false;
            return (
              <div key={key} {...facetedLabelsFilterStyleProps('labelGroup')}>
                <button type="button" {...facetedLabelsFilterStyleProps('labelKey')} onClick={() => toggleExpanded(key)}>
                  <Icon name={isExpanded ? 'angle-down' : 'angle-right'} size="sm" />
                  <span {...facetedLabelsFilterStyleProps('keyName')}>{key}</span>
                  {selectedValues.length > 0 && <span {...facetedLabelsFilterStyleProps('count')}>{selectedValues.length}</span>}
                </button>
                {isExpanded &&
                  renderCheckboxList(
                    key,
                    labels[key],
                    facetedLabelsFilterStyleProps('checkboxListIndented').className ?? ''
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

FacetedLabelsFilter.displayName = 'FacetedLabelsFilter';

