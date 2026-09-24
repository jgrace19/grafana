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
import DOMPurify from 'dompurify';
import { type PropsWithChildren } from 'react';

import { type PluginExtensionLink, type TraceKeyValuePair } from '@grafana/data';
import { Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';

import CopyIcon from '../../common/CopyIcon';
import { useTraceColorVars } from '../../traceColorVars';
import { traceColors } from '../../traceColors.stylex';
import type TNil from '../../types/TNil';

import jsonMarkup from './jsonMarkup';

import './KeyValuesTable.global.css';

const jsonObjectOrArrayStartRegex = /^(\[|\{)/;

function parseIfComplexJson(value: unknown) {
  // if the value is a string representing actual json object or array, then use json-markup
  if (typeof value === 'string' && jsonObjectOrArrayStartRegex.test(value)) {
    // otherwise just return as is
    try {
      return JSON.parse(value);
      // eslint-disable-next-line no-empty
    } catch (_) {}
  }
  return value;
}

export type KeyValuesTableLink = Pick<PluginExtensionLink, 'path' | 'title' | 'onClick' | 'icon'>;

interface LinkValueProps {
  link: KeyValuesTableLink;
}

export const LinkValue = ({ link, children }: PropsWithChildren<LinkValueProps>) => {
  const { path, title = '', onClick, icon = 'external-link-alt' } = link;

  return (
    <a href={path} title={title} onClick={onClick} target="_blank" rel="noopener noreferrer">
      {children} <Icon name={icon} />
    </a>
  );
};

export type KeyValuesTableProps = {
  data: TraceKeyValuePair[];
  linksGetter?: ((pairs: TraceKeyValuePair[], index: number) => KeyValuesTableLink[]) | TNil;
  onlyValues?: boolean;
};

export default function KeyValuesTable(props: KeyValuesTableProps) {
  const { data, linksGetter, onlyValues } = props;
  // Also rendered outside TraceView (provisioning job details), which doesn't set these vars.
  const traceColorVars = useTraceColorVars();
  return (
    <div
      {...mergeStylexProps(stylex.props(styles.KeyValueTable), { style: traceColorVars })}
      data-testid="KeyValueTable"
    >
      <table {...stylex.props(styles.table)}>
        <tbody {...stylex.props(styles.body)}>
          {data.map((row, i) => {
            let html = '';
            if (row.type === 'code') {
              html = `<pre style="border: none; background: none">${row.value}</pre>`;
            } else if (row.type === 'text') {
              html = `<span style="white-space: pre-wrap;">${row.value}</span>`;
            } else {
              html = jsonMarkup(parseIfComplexJson(row.value));
            }

            const jsonTable = (
              <div {...stylex.props(styles.jsonTable)} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
            );
            const links = linksGetter?.(data, i);
            let valueMarkup;
            if (links && links.length) {
              // TODO: handle multiple items
              valueMarkup = (
                <div>
                  <LinkValue link={links[0]}>{jsonTable}</LinkValue>
                </div>
              );
            } else {
              valueMarkup = jsonTable;
            }
            // `:nth-child(2n) > td`: every second row.
            const cell = [styles.cell, i % 2 === 1 && styles.cellEvenRow];
            return (
              // `i` is necessary in the key because row.key can repeat
              <tr className="gf-trace-key-values-row" key={`${row.key}-${i}`}>
                {!onlyValues && (
                  <td {...stylex.props(cell, styles.keyColumn)} data-testid="KeyValueTable--keyColumn">
                    {row.key}
                  </td>
                )}
                <td {...stylex.props(cell)}>{valueMarkup}</td>
                <td {...stylex.props(cell, styles.copyColumn)}>
                  <CopyIcon
                    copyText={row.type === 'code' || row.type === 'text' ? row.value : JSON.stringify(row, null, 2)}
                    tooltipTitle="Copy"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = stylex.create({
  KeyValueTable: {
    backgroundColor: traceColors['--gf-trace-fff'],
    maxHeight: '450px',
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  body: {
    verticalAlign: 'baseline',
  },
  cell: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    height: '30px',
  },
  cellEvenRow: {
    backgroundColor: traceColors['--gf-trace-f5f5f5'],
  },
  keyColumn: {
    color: traceColors['--gf-trace-888'],
    whiteSpace: 'pre',
    width: '125px',
  },
  copyColumn: {
    textAlign: 'right',
  },
  jsonTable: {
    display: 'inline-block',
  },
});
