import * as stylex from '@stylexjs/stylex';

import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { type RawListValue } from './RawListItem';
import { rawListLayout } from './rawListLayout.stylex';
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
    <div role={'cell'} {...stylex.props(styles.rowValuesWrap, styles.rowValuesWrapWidth(totalNumberOfValues))}>
      {values?.map((value) => {
        if (hideFieldsWithoutValues && (value.value === undefined || value.value === RawPrometheusListItemEmptyValue)) {
          return null;
        }

        return (
          <span key={value.key} {...stylex.props(styles.rowWrapper)}>
            <span {...stylex.props(styles.rowValue)}>{value.value}</span>
          </span>
        );
      })}
    </div>
  );
};

const styles = stylex.create({
  rowWrapper: {
    position: 'relative',
    minWidth: rawListLayout.columnWidth,
    paddingRight: '5px',
  },
  rowValue: {
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    scrollbarWidth: 'none' /* Firefox */,
    display: 'block',
    paddingRight: '10px',
    '::-webkit-scrollbar': {
      display: 'none' /* Chrome, Safari and Opera */,
    },
    '::before': {
      pointerEvents: 'none',
      content: "''",
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundImage: `linear-gradient(to right, transparent calc(100% - 25px), ${colors['--gf-colors-background-primary']})`,
    },
  },
  rowValuesWrap: {
    paddingLeft: rawListLayout.copyIconSpace,
    display: 'flex',
  },
  rowValuesWrapWidth: (totalNumberOfValues: number) => ({
    width: `calc(${totalNumberOfValues} * ${rawListLayout.columnWidth})`,
  }),
});
