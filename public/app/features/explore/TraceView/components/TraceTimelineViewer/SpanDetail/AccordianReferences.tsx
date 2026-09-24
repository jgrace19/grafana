import clsx from 'clsx';
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
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { accordianReferencesStyles } from './AccordianReferences.stylex';
import * as React from 'react';

import { type Field, type GrafanaTheme2, type LinkModel } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Counter, Icon, useStyles2 } from '@grafana/ui';

import { autoColor } from '../../Theme';
import { type TraceSpanReference } from '../../types/trace';
import ReferenceLink from '../../url/ReferenceLink';

import AccordianKeyValues from './AccordianKeyValues';

import { alignIcon } from '.';


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
    <div {...stylex.props(accordianReferencesStyles.AccordianReferencesContent)}>
      {data.map((reference, i) => (
        <div className={i < data.length - 1 ? mergeStylexClassName(stylex.props(accordianReferencesStyles.AccordianReferenceItem), undefined).className : undefined} key={i}>
          <div {...stylex.props(accordianReferencesStyles.item)} key={`${reference.spanID}`}>
            <ReferenceLink reference={reference} createFocusSpanLink={createFocusSpanLink}>
              <span {...stylex.props(accordianReferencesStyles.itemContent)}>
                {reference.span ? (
                  <span>
                    <span {...mergeStylexClassName(stylex.props(accordianReferencesStyles.serviceName, 'span-svc-name', ), undefined)}>
                      {reference.span.process.serviceName}
                    </span>
                    <small className="endpoint-name">{reference.span.operationName}</small>
                  </span>
                ) : (
                  <span {...mergeStylexClassName(stylex.props(accordianReferencesStyles.title, 'span-svc-name', ), undefined)}>
                    <Trans i18nKey="explore.accordian-references.view-linked-span">View Linked Span</Trans>{' '}
                    <Icon name="external-link-alt" />
                  </span>
                )}
                <small {...stylex.props(accordianReferencesStyles.debugInfo)}>
                  <span {...stylex.props(accordianReferencesStyles.debugLabel)} data-label="TraceID:">
                    {reference.traceID}
                  </span>
                  <span {...stylex.props(accordianReferencesStyles.debugLabel)} data-label="SpanID:">
                    {reference.spanID}
                  </span>
                </small>
              </span>
            </ReferenceLink>
          </div>
          {!!reference.tags?.length && (
            <div {...stylex.props(accordianReferencesStyles.AccordianKeyValues)}>
              <AccordianKeyValues
                className={i < data.length - 1 ? mergeStylexClassName(stylex.props(accordianReferencesStyles.AccordianKeyValuesItem), undefined).className : null}
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
      <Icon name={'angle-down'} className={alignIcon} />
    ) : (
      <Icon name={'angle-right'} className={alignIcon} />
    );
    HeaderComponent = 'a';
    headerProps = {
      'aria-checked': isOpen,
      onClick: isEmpty ? null : onToggle,
      role: 'switch',
    };
  }
  return (
    <div {...stylex.props(accordianReferencesStyles.AccordianReferences)}>
      <HeaderComponent {...stylex.props(accordianReferencesStyles.AccordianReferencesHeader)} {...headerProps}>
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
