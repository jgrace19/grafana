import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { rawListItemStyles } from './RawListItem.stylex';
import { useCopyToClipboard } from 'react-use';

import { type Field, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { isValidLegacyName, utf8Support } from '@grafana/prometheus';
import { reportInteraction } from '@grafana/runtime';
import { IconButton, useStyles2 } from '@grafana/ui';

import { ItemLabels } from './ItemLabels';
import { ItemValues } from './ItemValues';
import { type instantQueryRawVirtualizedListData } from './RawListContainer';
import RawListItemAttributes from './RawListItemAttributes';

export interface RawListProps {
  listItemData: instantQueryRawVirtualizedListData;
  listKey: string;
  totalNumberOfValues: number;
  valueLabels?: Field[];
  isExpandedView: boolean;
}

export type RawListValue = { key: string; value: string };
export const rawListExtraSpaceAtEndOfLine = '20px';
export const rawListItemColumnWidth = '80px';
export const rawListPaddingToHoldSpaceForCopyIcon = '25px';


function getQueryValues(allLabels: Pick<instantQueryRawVirtualizedListData, 'Value' | string | number>) {
  let attributeValues: RawListValue[] = [];
  let values: RawListValue[] = [];
  for (const key in allLabels) {
    if (key in allLabels && allLabels[key] && !key.includes('Value')) {
      attributeValues.push({
        key: key,
        value: allLabels[key],
      });
    } else if (key in allLabels && allLabels[key] && key.includes('Value')) {
      values.push({
        key: key,
        value: allLabels[key],
      });
    }
  }
  return {
    values: values,
    attributeValues: attributeValues,
  };
}

const RawListItem = ({ listItemData, listKey, totalNumberOfValues, valueLabels, isExpandedView }: RawListProps) => {
  const { __name__, ...allLabels } = listItemData;
  // We must know whether it is a utf8 metric name or not
  const isLegacyMetric = isValidLegacyName(__name__ ?? '');
  const [_, copyToClipboard] = useCopyToClipboard();
  const displayLength = valueLabels?.length ?? totalNumberOfValues;

  const { values, attributeValues } = getQueryValues(allLabels);

  /**
   * Transform the symbols in the dataFrame to uniform strings
   */
  const transformCopyValue = (value: string): string => {
    if (value === '∞' || value === 'Infinity') {
      return '+Inf';
    }
    return value;
  };

  // Convert the object back into a string
  const stringRep = `${isLegacyMetric ? __name__ : ''}{${isLegacyMetric ? '' : `"${__name__}", `}${attributeValues.map(
    (value) => {
      // For histograms the string representation currently in this object is not directly queryable in all situations, leading to broken copied queries. Omitting the attribute from the copied result gives a query which returns all le values, which I assume to be a more common use case.
      return `${utf8Support(value.key)}="${transformCopyValue(value.value)}"`;
    }
  )}}`;

  const hideFieldsWithoutValues = Boolean(valueLabels && valueLabels?.length);

  return (
    <>
      {valueLabels !== undefined && isExpandedView && (
        <ItemLabels valueLabels={valueLabels} expanded={isExpandedView} />
      )}
      <div key={listKey} {...stylex.props(rawListItemStyles.rowWrapper)}>
        <span {...stylex.props(rawListItemStyles.copyToClipboardWrapper)}>
          <IconButton
            tooltip={t('explore.raw-list-item.tooltip-copy-to-clipboard', 'Copy to clipboard')}
            onClick={() => {
              reportInteraction('grafana_explore_prometheus_instant_query_ui_raw_toggle_expand');
              copyToClipboard(stringRep);
            }}
            name="copy"
          />
        </span>
        <span role={'cell'} {...stylex.props(rawListItemStyles.rowLabelWrapWrap)}>
          <div {...stylex.props(rawListItemStyles.rowLabelWrap)}>
            {!!__name__ && isLegacyMetric && <span>{__name__}</span>}
            <span>{`{`}</span>
            {!isLegacyMetric && !!__name__ && __name__ !== '' && (
              <span>
                &#34;{__name__}&#34;{', '}
              </span>
            )}
            <span>
              {attributeValues.map((value, index) => (
                <RawListItemAttributes
                  isExpandedView={isExpandedView}
                  value={value}
                  key={index}
                  index={index}
                  length={attributeValues.length}
                />
              ))}
            </span>
            <span>{`}`}</span>
          </div>
        </span>

        {/* Output the values */}
        <ItemValues
          hideFieldsWithoutValues={hideFieldsWithoutValues}
          totalNumberOfValues={displayLength}
          values={values}
        />
      </div>
    </>
  );
};
export default RawListItem;
