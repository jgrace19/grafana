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

import { type TraceKeyValuePair } from '@grafana/data';
import { Counter, Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';

import { traceColors } from '../../traceColors.stylex';
import type TNil from '../../types/TNil';

import * as markers from './AccordianKeyValues.markers';
import KeyValuesTable, { type KeyValuesTableLink } from './KeyValuesTable';

import { alignIconStyles } from '.';

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
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
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
    <ul {...stylex.props(styles.summary)}>
      {data.map((item, i) => (
        // `i` is necessary in the key because item.key can repeat
        <li {...stylex.props(styles.summaryItem)} key={`${item.key}-${i}`}>
          <span {...stylex.props(styles.summaryLabel)}>{item.key}</span>
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
  xstyle,
}: AccordianKeyValuesProps) {
  const isEmpty = (!Array.isArray(data) || !data.length) && !logName;
  const iconXstyle = [alignIconStyles.alignIcon, isEmpty && styles.emptyIcon];
  let arrow: React.ReactNode | null = null;
  let headerProps: {} | null = null;
  const tableFields = logName ? [{ key: 'event name', value: logName }, ...data] : data;
  if (interactive) {
    arrow = isOpen ? (
      <Icon name={'angle-down'} xstyle={iconXstyle} />
    ) : (
      <Icon name={'angle-right'} xstyle={iconXstyle} />
    );
    headerProps = {
      'aria-checked': isOpen,
      onClick: isEmpty ? null : onToggle,
      role: 'switch',
    };
  }

  const showDataSummaryFields = showSummary && data.length > 0 && !isOpen;

  return (
    <div {...mergeStylexProps(stylex.props(styles.container, xstyle), { className: className ?? undefined })}>
      <div
        {...stylex.props(
          styles.header,
          isEmpty && styles.headerEmpty,
          highContrast && !isEmpty && styles.headerHighContrast
        )}
        {...headerProps}
        data-testid="AccordianKeyValues--header"
      >
        {arrow}
        <strong data-test={markers.LABEL} {...stylex.props(styles.headerLabel)}>
          {label}
          {showCountBadge ? <Counter value={data.length} variant="secondary" /> : null}
        </strong>
        {showDataSummaryFields && (
          <span {...stylex.props(styles.summaryWrapper)}>
            <KeyValuesSummary data={data} />
          </span>
        )}
      </div>
      {isOpen && <KeyValuesTable data={tableFields} linksGetter={linksGetter} onlyValues={onlyValues} />}
    </div>
  );
}

const styles = stylex.create({
  container: {
    textOverflow: 'ellipsis',
  },
  header: {
    cursor: 'pointer',
    overflow: 'hidden',
    paddingTop: '0.25em',
    paddingBottom: '0.25em',
    paddingLeft: '0.1em',
    paddingRight: '0.1em',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  headerLabel: {
    width: '120px',
    display: 'inline-block',
  },
  headerEmpty: {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    cursor: 'initial',
  },
  headerHighContrast: {
    backgroundColor: { default: null, ':hover': traceColors['--gf-trace-ddd'] },
  },
  emptyIcon: {
    color: traceColors['--gf-trace-aaa'],
  },
  summaryWrapper: {
    marginLeft: '0.7em',
  },
  summary: {
    display: 'inline',
    listStyle: 'none',
    padding: 0,
  },
  summaryItem: {
    display: 'inline',
    paddingRight: { default: '0.5rem', ':last-child': 0 },
    borderRightStyle: { default: null, ':last-child': 'none' },
  },
  summaryLabel: {
    color: traceColors['--gf-trace-777'],
    paddingRight: '0.5rem',
  },
});
