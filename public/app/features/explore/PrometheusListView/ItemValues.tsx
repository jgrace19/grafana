

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { itemValuesStyles } from './ItemValues.stylex';
import { rawListItemColumnWidth, rawListPaddingToHoldSpaceForCopyIcon, type RawListValue } from './RawListItem';
import { RawPrometheusListItemEmptyValue } from './utils/getRawPrometheusListItemsFromDataFrame';


export const ItemValues = ({
  totalNumberOfValues,
  values,
  hideFieldsWithoutValues,
}: {
  totalNumberOfValues: number;
  values: RawListValue[];
  hideFieldsWithoutValues: boolean;
}) => {
  return (
    <div role={'cell'} {...stylex.props(itemValuesStyles.rowValuesWrap)}>
      {values?.map((value) => {
        if (hideFieldsWithoutValues && (value.value === undefined || value.value === RawPrometheusListItemEmptyValue)) {
          return null;
        }

        return (
          <span key={value.key} {...stylex.props(itemValuesStyles.rowWrapper)}>
            <span {...stylex.props(itemValuesStyles.rowValue)}>{value.value}</span>
          </span>
        );
      })}
    </div>
  );
};
