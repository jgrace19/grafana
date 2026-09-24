import * as stylex from '@stylexjs/stylex';
import { type Property } from 'csstype';

import { fieldReducers, type KeyValue, ReducerID } from '@grafana/data';

export type FooterItem = Array<KeyValue<string>> | string | undefined;

export interface FooterProps {
  value: FooterItem;
  justifyContent?: Property.JustifyContent;
}

export const FooterCell = (props: FooterProps) => {
  if (props.value && !Array.isArray(props.value)) {
    return <span {...stylex.props(styles.item(props.justifyContent || 'space-between'))}>{props.value}</span>;
  }

  if (props.value && Array.isArray(props.value) && props.value.length > 0) {
    return (
      <ul {...stylex.props(styles.cell)}>
        {props.value.map((v: KeyValue<string>, i) => {
          const key = Object.keys(v)[0];
          return (
            <li {...stylex.props(styles.list)} key={i}>
              <span>{key}</span>
              <span>{v[key]}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return EmptyCell;
};

export const EmptyCell = () => {
  return <span>&nbsp;</span>;
};

export function getFooterValue(
  index: number,
  footerValues?: FooterItem[],
  isCountRowsSet?: boolean,
  justifyContent?: Property.JustifyContent
) {
  if (footerValues === undefined) {
    return EmptyCell;
  }

  if (isCountRowsSet) {
    if (footerValues[index] === undefined) {
      return EmptyCell;
    }

    const key = fieldReducers.get(ReducerID.count).name;

    return FooterCell({ value: [{ [key]: String(footerValues[index]) }] });
  }

  return FooterCell({ value: footerValues[index], justifyContent });
}

const styles = stylex.create({
  cell: {
    width: '100%',
    listStyleType: 'none',
  },
  item: (justifyContent: Property.JustifyContent) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent,
  }),
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
