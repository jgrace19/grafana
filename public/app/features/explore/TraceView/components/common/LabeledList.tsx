// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type IconName } from '@grafana/data';
import { Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, typography } from '@grafana/ui/stylex/tokens.stylex';

import { traceColors } from '../traceColors.stylex';

type LabeledListProps = {
  className?: string;
  divider?: boolean;
  items: Array<{ key: string; label: React.ReactNode; value: React.ReactNode; icon?: IconName }>;
  color?: string;
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
};

export default function LabeledList(props: LabeledListProps) {
  const { className, divider = false, items, color, xstyle } = props;

  return (
    <ul
      {...mergeStylexProps(stylex.props(styles.LabeledList, divider && styles.LabeledListDivider, xstyle), {
        className,
      })}
    >
      {items.map(({ key, label, value, icon }) => {
        return (
          // If label is service, create small line on left with color
          <li
            {...stylex.props(
              styles.LabeledListItem,
              divider ? styles.LabeledListItemDivider : styles.LabeledListItemNoDivider
            )}
            key={`${key}`}
          >
            {label === 'Service:' && (
              <div
                {...mergeStylexProps(stylex.props(styles.LabeledListServiceLine), {
                  style: { backgroundColor: color },
                })}
              />
            )}
            {icon && <Icon name={icon} xstyle={styles.LabeledListIcon} size="sm" />}
            <span {...stylex.props(styles.LabeledListLabel)}>{label}</span>
            <strong {...stylex.props(styles.LabeledListValue, !divider && styles.LabeledListValueNoDivider)}>
              {value}
            </strong>
          </li>
        );
      })}
    </ul>
  );
}

const styles = stylex.create({
  LabeledList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: typography['--gf-typography-size-sm'],
  },
  LabeledListDivider: {
    marginRight: '-8px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  LabeledListItem: {
    display: 'inline-block',
  },
  LabeledListItemDivider: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: traceColors['--gf-trace-ddd'],
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  LabeledListItemNoDivider: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  LabeledListLabel: {
    color: colors['--gf-colors-text-secondary'],
    marginRight: '0.25rem',
  },
  LabeledListValue: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
  },
  LabeledListValueNoDivider: {
    marginRight: '0.55rem',
  },
  LabeledListIcon: {
    marginRight: '0.25rem',
    marginTop: '-0.1rem',
  },
  LabeledListServiceLine: {
    display: 'inline-block',
    width: '1rem',
    height: '0.35rem',
    marginRight: '0.5rem',
    verticalAlign: 'middle',
    borderRadius: shape['--gf-shape-radius-default'],
  },
});
