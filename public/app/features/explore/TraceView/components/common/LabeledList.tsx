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

import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type IconName } from '@grafana/data';
import { Icon } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { labeledListStyles } from './LabeledList.stylex';

type LabeledListProps = {
  className?: string;
  divider?: boolean;
  items: Array<{ key: string; label: React.ReactNode; value: React.ReactNode; icon?: IconName }>;
  color?: string;
};

export default function LabeledList(props: LabeledListProps) {
  const { className, divider = false, items, color } = props;

  return (
    <ul
      {...mergeStylexClassName(
        stylex.props(labeledListStyles.list, divider && labeledListStyles.listWithDivider),
        className
      )}
    >
      {items.map(({ key, label, value, icon }) => {
        return (
          <li
            {...stylex.props(labeledListStyles.item, divider && labeledListStyles.itemDivider)}
            key={`${key}`}
          >
            {label === 'Service:' && (
              <div {...stylex.props(labeledListStyles.serviceLine)} style={{ backgroundColor: color }} />
            )}
            {icon && <Icon name={icon} {...stylex.props(labeledListStyles.icon)} size="sm" />}
            <span {...stylex.props(labeledListStyles.label)}>{label}</span>
            <strong {...stylex.props(divider ? labeledListStyles.valueDivider : labeledListStyles.value)}>
              {value}
            </strong>
          </li>
        );
      })}
    </ul>
  );
}
