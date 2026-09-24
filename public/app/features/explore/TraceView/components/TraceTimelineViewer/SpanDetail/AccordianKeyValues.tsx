import clsx from 'clsx';
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
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { accordianKeyValuesStyles } from './AccordianKeyValues.stylex';
import cx from 'classnames';
import * as React from 'react';

import { Counter, Icon, useStyles2 } from '@grafana/ui';

import { autoColor } from '../../Theme';
import type TNil from '../../types/TNil';

import * as markers from './AccordianKeyValues.markers';
import KeyValuesTable, { type KeyValuesTableLink } from './KeyValuesTable';

import { alignIcon } from '.';

export ;

export type AccordianKeyValuesProps = {
  className?: string | TNil;
  data: TraceKeyValuePair[];
  logName?: string;
  highContrast?: boolean;
  interactive?: boolean;
  onlyValues?: boolean;
  showSummary?: boolean;
  showCountBadge?: boolean;
  isOpen: boolean;
  label: string | React.ReactNode;
  linksGetter?: ((pairs: TraceKeyValuePair[], index: number) => KeyValuesTableLink[]) | TNil;
  onToggle?: null | (() => void);
};

interface KeyValuesSummaryProps {
  data?: TraceKeyValuePair[] | null;
}

// export for tests
export function KeyValuesSummary({ data = null }: KeyValuesSummaryProps) {

  if (!Array.isArray(data) || !data.length) {
    return null;
  }

  return (
    <ul {...stylex.props(accordianKeyValuesStyles.summary)}>
      {data.map((item, i) => (
        // `i` is necessary in the key because item.key can repeat
        <li {...stylex.props(accordianKeyValuesStyles.summaryItem)} key={`${item.key}-${i}`}>
          <span {...stylex.props(accordianKeyValuesStyles.summaryLabel)}>{item.key}</span>
          {String(item.value)}
        </li>
      ))}
    </ul>
  );
}

export default function AccordianKeyValues({
  className = null,
  data,
  logName,
  highContrast = false,
  interactive = true,
  isOpen,
  label,
  linksGetter,
  onlyValues = false,
  showSummary = true,
  showCountBadge = false,
  onToggle = null,
}: AccordianKeyValuesProps) {
  const isEmpty = (!Array.isArray(data) || !data.length) && !logName;
  const iconCls = clsx(alignIcon, { [mergeStylexClassName(stylex.props(accordianKeyValuesStyles.emptyIcon), undefined).className]: isEmpty });
  let arrow: React.ReactNode | null = null;
  let headerProps: {} | null = null;
  const tableFields = logName ? [{ key: 'event name', value: logName }, ...data] : data;
  if (interactive) {
    arrow = isOpen ? (
      <Icon name={'angle-down'} className={iconCls} />
    ) : (
      <Icon name={'angle-right'} className={iconCls} />
    );
    headerProps = {
      'aria-checked': isOpen,
      onClick: isEmpty ? null : onToggle,
      role: 'switch',
    };
  }

  const showDataSummaryFields = showSummary && data.length > 0 && !isOpen;

  return (
    <div {...mergeStylexClassName(stylex.props(accordianKeyValuesStyles.container, className, ), undefined)}>
      <div
        {...mergeStylexClassName(stylex.props(accordianKeyValuesStyles.header, , {
          [mergeStylexClassName(stylex.props(accordianKeyValuesStyles.headerEmpty), undefined).className]: isEmpty,
          [mergeStylexClassName(stylex.props(accordianKeyValuesStyles.headerHighContrast), undefined).className]: highContrast && !isEmpty,
        }), undefined)}
        {...headerProps}
        data-testid="AccordianKeyValues--header"
      >
        {arrow}
        <strong data-test={markers.LABEL} {...stylex.props(accordianKeyValuesStyles.headerLabel)}>
          {label}
          {showCountBadge ? <Counter value={data.length} variant="secondary" /> : null}
        </strong>
        {showDataSummaryFields && (
          <span className={css({ marginLeft: '0.7em' })}>
            <KeyValuesSummary data={data} />
          </span>
        )}
      </div>
      {isOpen && <KeyValuesTable data={tableFields} linksGetter={linksGetter} onlyValues={onlyValues} />}
    </div>
  );
}
