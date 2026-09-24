import * as stylex from '@stylexjs/stylex';
import { useCopyToClipboard } from 'react-use';

import { type Field } from '@grafana/data';
import { t } from '@grafana/i18n';
import { isValidLegacyName, utf8Support } from '@grafana/prometheus';
import { reportInteraction } from '@grafana/runtime';
import { IconButton } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { ItemLabels } from './ItemLabels';
import { ItemValues } from './ItemValues';
import { type instantQueryRawVirtualizedListData } from './RawListContainer';
import RawListItemAttributes from './RawListItemAttributes';
import { rawListLayout } from './rawListLayout.stylex';

export interface RawListProps {
  listItemData: instantQueryRawVirtualizedListData;
  listKey: string;
  totalNumberOfValues: number;
  valueLabels?: Field[];
  isExpandedView: boolean;
}

export type RawListValue = { key: string; value: string };

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
      <div key={listKey} {...stylex.props(styles.rowWrapper, !isExpandedView && styles.rowWrapperCollapsed)}>
        <span
          {...stylex.props(
            styles.copyToClipboardWrapper,
            isExpandedView ? styles.copyToClipboardWrapperExpanded : styles.copyToClipboardWrapperCollapsed
          )}
        >
          <IconButton
            tooltip={t('explore.raw-list-item.tooltip-copy-to-clipboard', 'Copy to clipboard')}
            onClick={() => {
              reportInteraction('grafana_explore_prometheus_instant_query_ui_raw_toggle_expand');
              copyToClipboard(stringRep);
            }}
            name="copy"
          />
        </span>
        <span role={'cell'} {...stylex.props(styles.rowLabelWrapWrap, styles.rowLabelWrapWrapWidth(displayLength))}>
          <div {...stylex.props(styles.rowLabelWrap)}>
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

const styles = stylex.create({
  rowWrapper: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    display: 'flex',
    position: 'relative',
    paddingLeft: '22px',
  },
  rowWrapperCollapsed: {
    alignItems: 'center',
    height: '100%',
  },
  copyToClipboardWrapper: {
    position: 'absolute',
    left: 0,
    margin: 'auto',
    zIndex: 1,
    height: '16px',
    width: '16px',
  },
  copyToClipboardWrapperCollapsed: {
    bottom: '0',
    top: '0',
  },
  copyToClipboardWrapperExpanded: {
    top: '4px',
  },
  rowLabelWrapWrap: {
    position: 'relative',
  },
  rowLabelWrapWrapWidth: (totalNumberOfValues: number) => ({
    width: `calc(100% - (${totalNumberOfValues} * ${rawListLayout.columnWidth}) - ${rawListLayout.copyIconSpace})`,
  }),
  rowLabelWrap: {
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    scrollbarWidth: 'none' /* Firefox */,
    paddingRight: rawListLayout.lineEndSpace,
    '::-webkit-scrollbar': {
      display: 'none' /* Chrome, Safari and Opera */,
    },
    '::after': {
      pointerEvents: 'none',
      content: "''",
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundImage: `linear-gradient(to right, transparent calc(100% - ${rawListLayout.lineEndSpace}), ${colors['--gf-colors-background-primary']})`,
    },
  },
});
