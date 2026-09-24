// Copyright (c) 2019 The Jaeger Authors.
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

import { type Field, type LinkModel } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Counter, Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { traceColors } from '../../traceColors.stylex';
import { type TraceSpanReference } from '../../types/trace';
import ReferenceLink from '../../url/ReferenceLink';

import AccordianKeyValues from './AccordianKeyValues';

import { alignIconStyles } from '.';

export type AccordianReferencesProps = {
  data: TraceSpanReference[];
  highContrast?: boolean;
  interactive?: boolean;
  isOpen: boolean;
  openedItems?: Set<TraceSpanReference>;
  onItemToggle?: (reference: TraceSpanReference) => void;
  onToggle?: null | (() => void);
  createFocusSpanLink: (traceId: string, spanId: string) => LinkModel<Field>;
};

type ReferenceItemProps = {
  data: TraceSpanReference[];
  interactive?: boolean;
  openedItems?: Set<TraceSpanReference>;
  onItemToggle?: (reference: TraceSpanReference) => void;
  createFocusSpanLink: (traceId: string, spanId: string) => LinkModel<Field>;
};

// export for test
export function References(props: ReferenceItemProps) {
  const { data, createFocusSpanLink, openedItems, onItemToggle, interactive } = props;

  return (
    <div {...stylex.props(styles.AccordianReferencesContent)}>
      {data.map((reference, i) => (
        <div {...stylex.props(i < data.length - 1 && styles.AccordianReferenceItem)} key={i}>
          <div {...stylex.props(styles.item)} key={`${reference.spanID}`}>
            <ReferenceLink reference={reference} createFocusSpanLink={createFocusSpanLink}>
              <span {...stylex.props(styles.itemContent)}>
                {reference.span ? (
                  <span>
                    <span {...mergeStylexProps(stylex.props(styles.serviceName), { className: 'span-svc-name' })}>
                      {reference.span.process.serviceName}
                    </span>
                    <small className="endpoint-name">{reference.span.operationName}</small>
                  </span>
                ) : (
                  <span {...mergeStylexProps(stylex.props(styles.title), { className: 'span-svc-name' })}>
                    <Trans i18nKey="explore.accordian-references.view-linked-span">View Linked Span</Trans>{' '}
                    <Icon name="external-link-alt" />
                  </span>
                )}
                <small {...stylex.props(styles.debugInfo)}>
                  <span {...stylex.props(styles.debugLabel)} data-label="TraceID:">
                    {reference.traceID}
                  </span>
                  <span {...stylex.props(styles.debugLabel)} data-label="SpanID:">
                    {reference.spanID}
                  </span>
                </small>
              </span>
            </ReferenceLink>
          </div>
          {!!reference.tags?.length && (
            <div {...stylex.props(styles.AccordianKeyValues)}>
              <AccordianKeyValues
                xstyle={i < data.length - 1 && styles.AccordianKeyValuesItem}
                data={reference.tags || []}
                highContrast
                interactive={interactive}
                isOpen={openedItems ? openedItems.has(reference) : false}
                label={t('explore.references.label-attributes', 'attributes')}
                onToggle={interactive && onItemToggle ? () => onItemToggle(reference) : null}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const AccordianReferences = ({
  data,
  interactive = true,
  isOpen,
  onToggle,
  onItemToggle,
  openedItems,
  createFocusSpanLink,
}: AccordianReferencesProps) => {
  const isEmpty = !Array.isArray(data) || !data.length;
  let arrow: React.ReactNode | null = null;
  let HeaderComponent: 'span' | 'a' = 'span';
  let headerProps: {} | null = null;
  if (interactive) {
    arrow = isOpen ? (
      <Icon name={'angle-down'} xstyle={alignIconStyles.alignIcon} />
    ) : (
      <Icon name={'angle-right'} xstyle={alignIconStyles.alignIcon} />
    );
    HeaderComponent = 'a';
    headerProps = {
      'aria-checked': isOpen,
      onClick: isEmpty ? null : onToggle,
      role: 'switch',
    };
  }

  return (
    <div {...stylex.props(styles.AccordianReferences)}>
      <HeaderComponent {...stylex.props(styles.AccordianReferencesHeader)} {...headerProps}>
        {arrow}
        <strong>
          <span>
            <Trans i18nKey="explore.accordian-references.references">References</Trans>
          </span>
        </strong>{' '}
        <Counter value={data.length} />
      </HeaderComponent>
      {isOpen && (
        <References
          data={data}
          openedItems={openedItems}
          createFocusSpanLink={createFocusSpanLink}
          onItemToggle={onItemToggle}
          interactive={interactive}
        />
      )}
    </div>
  );
};

export default React.memo(AccordianReferences);

const styles = stylex.create({
  AccordianReferenceItem: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: traceColors['--gf-trace-d8d8d8'],
  },
  AccordianKeyValues: {
    marginLeft: '10px',
  },
  AccordianReferences: {
    position: 'relative',
  },
  AccordianReferencesHeader: {
    color: 'inherit',
    display: 'block',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    paddingLeft: 0,
    paddingRight: 0,
  },
  AccordianReferencesContent: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: traceColors['--gf-trace-d8d8d8'],
    paddingTop: '0.5rem',
    paddingRight: '0.5rem',
    paddingBottom: '0.25rem',
    paddingLeft: '0.5rem',
  },
  AccordianKeyValuesItem: {
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
  itemContent: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: { default: null, ':nth-child(2n)': '#f5f5f5' },
  },
  debugInfo: {
    letterSpacing: '0.25px',
    marginTop: '0.5em',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexWrap: 'wrap',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  debugLabel: {
    marginTop: 0,
    marginRight: '5px',
    marginBottom: 0,
    marginLeft: '5px',
    '::before': {
      color: traceColors['--gf-trace-666'],
      content: 'attr(data-label)',
    },
  },
  serviceName: {
    marginRight: '8px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
});
