import * as stylex from '@stylexjs/stylex';

import { type KeyValue } from '@grafana/data';

import { type FooterItem } from '../types';

export interface FooterProps {
  value: FooterItem;
}

export const FooterCell = (props: FooterProps) => {
  if (props.value && !Array.isArray(props.value)) {
    return <span>{props.value}</span>;
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

const styles = stylex.create({
  cell: {
    width: '100%',
    listStyleType: 'none',
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
