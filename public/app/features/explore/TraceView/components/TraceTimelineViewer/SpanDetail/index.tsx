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

import { SpanStatusCode } from '@opentelemetry/api';
import * as stylex from '@stylexjs/stylex';
import React, { useCallback, useMemo, useRef } from 'react';

import {
  type CoreApp,
  type DataFrame,
  dateTimeFormat,
  type LinkModel,
  type TimeRange,
  type TraceKeyValuePair,
  type TraceLog,
  type PluginExtensionResourceAttributesContext,
  PluginExtensionPoints,
  type IconName,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { type TraceToProfilesOptions } from '@grafana/o11y-ds-frontend';
import { usePluginLinks } from '@grafana/runtime';
import { type TimeZone } from '@grafana/schema';
import { Icon } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { pyroscopeProfileIdTagKey } from '../../../createSpanLink';
import LabeledList from '../../common/LabeledList';
import { KIND, LIBRARY_NAME, LIBRARY_VERSION, STATUS, STATUS_MESSAGE, TRACE_STATE } from '../../constants/span';
import { traceColors } from '../../traceColors.stylex';
import { type SpanLinkFunc } from '../../types/links';
import { type TraceProcess, type TraceSpan, type TraceSpanReference } from '../../types/trace';
import { formatDuration } from '../../utils/date';
import { getServiceDisplayName } from '../../utils/service-name';

import AccordianKeyValues from './AccordianKeyValues';
import AccordianLogs from './AccordianLogs';
import AccordianReferences from './AccordianReferences';
import type DetailState from './DetailState';
import { ShareSpanButton } from './ShareSpanButton';
import { getSpanDetailLinkButtons } from './SpanDetailLinkButtons';
import SpanFlameGraph from './SpanFlameGraph';

const useResourceAttributesExtensionLinks = ({
  process,
  spanTags,
  datasourceType,
  datasourceUid,
  timeRange,
  traceID,
  spanID,
  spanStartTime,
}: {
  process: TraceProcess;
  spanTags: TraceKeyValuePair[];
  datasourceType: string;
  datasourceUid: string;
  timeRange: TimeRange;
  traceID: string;
  spanID: string;
  spanStartTime: number;
}) => {
  // Stable context for useMemo inside usePluginLinks
  const context: PluginExtensionResourceAttributesContext = useMemo(() => {
    const attributes = (process.tags ?? []).reduce<Record<string, string[]>>((acc, tag) => {
      if (acc[tag.key]) {
        acc[tag.key].push(tag.value);
      } else {
        acc[tag.key] = [tag.value];
      }
      return acc;
    }, {});

    const spanAttributes = (spanTags ?? []).reduce<Record<string, string[]>>((acc, tag) => {
      if (acc[tag.key]) {
        acc[tag.key].push(tag.value);
      } else {
        acc[tag.key] = [tag.value];
      }
      return acc;
    }, {});

    return {
      attributes,
      spanAttributes,
      timeRange: { from: timeRange.from.valueOf(), to: timeRange.to.valueOf() },
      datasource: {
        type: datasourceType,
        uid: datasourceUid,
      },
      traceID,
      spanID,
      spanStartTime,
    };
  }, [process.tags, spanTags, datasourceType, datasourceUid, timeRange, traceID, spanID, spanStartTime]);

  const { links } = usePluginLinks({
    extensionPointId: PluginExtensionPoints.TraceViewResourceAttributes,
    limitPerPlugin: 10,
    context,
  });

  const resourceLinksGetter = useCallback(
    (pairs: TraceKeyValuePair[], index: number) => {
      const { key } = pairs[index] ?? {};
      return links.filter((link) => link.category === key);
    },
    [links]
  );

  return resourceLinksGetter;
};

export const alignIconStyles = stylex.create({
  alignIcon: {
    marginTop: '-0.2rem',
    marginRight: '0.25rem',
    marginBottom: 0,
    marginLeft: 0,
  },
});

export type TraceFlameGraphs = {
  [spanID: string]: DataFrame;
};

export type SpanDetailProps = {
  color: string;
  detailState: DetailState;
  logItemToggle: (spanID: string, log: TraceLog) => void;
  logsToggle: (spanID: string) => void;
  processToggle: (spanID: string) => void;
  span: TraceSpan;
  traceToProfilesOptions?: TraceToProfilesOptions;
  timeZone: TimeZone;
  tagsToggle: (spanID: string) => void;
  traceStartTime: number;
  traceDuration: number;
  traceName: string;
  warningsToggle: (spanID: string) => void;
  stackTracesToggle: (spanID: string) => void;
  referenceItemToggle: (spanID: string, reference: TraceSpanReference) => void;
  referencesToggle: (spanID: string) => void;
  createSpanLink?: SpanLinkFunc;
  focusedSpanId?: string;
  createFocusSpanLink: (traceId: string, spanId: string) => LinkModel;
  datasourceType: string;
  datasourceUid: string;
  traceFlameGraphs: TraceFlameGraphs;
  setTraceFlameGraphs: (flameGraphs: TraceFlameGraphs) => void;
  setRedrawListView: (redraw: {}) => void;
  timeRange: TimeRange;
  app: CoreApp;
};

export default function SpanDetail(props: SpanDetailProps) {
  const {
    color,
    detailState,
    logItemToggle,
    logsToggle,
    processToggle,
    span,
    tagsToggle,
    traceStartTime,
    traceDuration,
    traceName,
    warningsToggle,
    stackTracesToggle,
    referencesToggle,
    referenceItemToggle,
    createSpanLink,
    createFocusSpanLink,
    datasourceType,
    datasourceUid,
    traceFlameGraphs,
    setTraceFlameGraphs,
    traceToProfilesOptions,
    setRedrawListView,
    timeRange,
    app,
  } = props;
  const {
    isTagsOpen,
    isProcessOpen,
    logs: logsState,
    isWarningsOpen,
    references: referencesState,
    isStackTracesOpen,
  } = detailState;
  const {
    operationName,
    process,
    duration,
    relativeStartTime,
    startTime,
    traceID,
    spanID,
    logs,
    tags,
    warnings,
    references,
    stackTraces,
  } = span;

  const { timeZone } = props;
  const durationIcon: IconName = 'hourglass';
  const startIcon: IconName = 'clock-nine';

  let overviewItems = [
    {
      key: 'svc',
      label: t('explore.span-detail.overview-items.label.service', 'Service:'),
      value: getServiceDisplayName(process),
    },
    {
      key: 'duration',
      label: t('explore.span-detail.overview-items.label.duration', 'Duration:'),
      value: formatDuration(duration),
      icon: durationIcon,
    },
    {
      key: 'start',
      label: t('explore.span-detail.overview-items.label.start-time', 'Start Time:'),
      value: formatDuration(relativeStartTime) + getAbsoluteTime(startTime, timeZone),
      icon: startIcon,
    },
    ...(span.childSpanCount > 0
      ? [
          {
            key: 'child_count',
            label: t('explore.span-detail.overview-items.label.child-count', 'Child Count:'),
            value: span.childSpanCount,
          },
        ]
      : []),
  ];

  const mainContainerRef = useRef<HTMLDivElement>(null);

  if (span.kind) {
    overviewItems.push({
      key: KIND,
      label: t('explore.span-detail.label.kind', 'Kind:'),
      value: span.kind,
    });
  }
  if (span.statusCode !== undefined) {
    overviewItems.push({
      key: STATUS,
      label: t('explore.span-detail.label.status', 'Status:'),
      value: SpanStatusCode[span.statusCode].toLowerCase(),
    });
  }
  if (span.statusMessage) {
    overviewItems.push({
      key: STATUS_MESSAGE,
      label: t('explore.span-detail.label.status-message', 'Status Message:'),
      value: span.statusMessage,
    });
  }
  if (span.instrumentationLibraryName) {
    overviewItems.push({
      key: LIBRARY_NAME,
      label: t('explore.span-detail.label.library-name', 'Library Name:'),
      value: span.instrumentationLibraryName,
    });
  }
  if (span.instrumentationLibraryVersion) {
    overviewItems.push({
      key: LIBRARY_VERSION,
      label: t('explore.span-detail.label.library-version', 'Library Version:'),
      value: span.instrumentationLibraryVersion,
    });
  }
  if (span.traceState) {
    overviewItems.push({
      key: TRACE_STATE,
      label: t('explore.span-detail.label.trace-state', 'Trace State:'),
      value: span.traceState,
    });
  }

  const { interpolatedParams, ...focusSpanLink } = createFocusSpanLink(traceID, spanID);
  const resourceLinksGetter = useResourceAttributesExtensionLinks({
    process,
    spanTags: tags,
    datasourceType,
    datasourceUid,
    timeRange,
    traceID,
    spanID,
    spanStartTime: startTime,
  });

  const linksComponent = getSpanDetailLinkButtons({
    span,
    createSpanLink,
    datasourceType,
    traceToProfilesOptions,
    timeRange,
    app,
    shareButton: <ShareSpanButton focusSpanLink={focusSpanLink} />,
  });

  const listOfContentCards = [];

  listOfContentCards.push(
    <AccordianKeyValues
      data={tags}
      label={t('explore.span-detail.label-span-attributes', 'Span attributes')}
      isOpen={isTagsOpen}
      linksGetter={resourceLinksGetter}
      onToggle={() => tagsToggle(spanID)}
    />
  );

  if (process.tags) {
    listOfContentCards.push(
      <AccordianKeyValues
        data={process.tags}
        label={t('explore.span-detail.label-resource-attributes', 'Resource attributes')}
        linksGetter={resourceLinksGetter}
        isOpen={isProcessOpen}
        onToggle={() => processToggle(spanID)}
      />
    );
  }

  if (logs && logs.length > 0) {
    listOfContentCards.push(
      <AccordianLogs
        logs={logs}
        isOpen={logsState.isOpen}
        openedItems={logsState.openedItems}
        onToggle={() => logsToggle(spanID)}
        onItemToggle={(logItem) => logItemToggle(spanID, logItem)}
        timestamp={traceStartTime}
      />
    );
  }

  if (warnings && warnings.length > 0) {
    listOfContentCards.push(
      <AccordianKeyValues
        data={warnings.map((warning) => ({
          key: '',
          value: warning,
          type: 'warning',
        }))}
        onlyValues={true}
        showSummary={false}
        showCountBadge={true}
        isOpen={isWarningsOpen}
        onToggle={() => warningsToggle(spanID)}
        label={t('explore.span-detail.label-warnings', 'Warnings')}
      />
    );
  }

  if (stackTraces?.length) {
    listOfContentCards.push(
      <AccordianKeyValues
        data={stackTraces.map((stackTrace) => ({
          key: '',
          value: stackTrace,
          type: 'code',
        }))}
        onlyValues={true}
        showSummary={false}
        showCountBadge={true}
        isOpen={isStackTracesOpen}
        onToggle={() => stackTracesToggle(spanID)}
        label={t('explore.span-detail.label-stack-trace', 'Stack trace')}
      />
    );
  }

  if (references && references.length > 0 && (references.length > 1 || references[0].refType !== 'CHILD_OF')) {
    listOfContentCards.push(
      <AccordianReferences
        data={references}
        isOpen={referencesState.isOpen}
        openedItems={referencesState.openedItems}
        onToggle={() => referencesToggle(spanID)}
        onItemToggle={(reference) => referenceItemToggle(spanID, reference)}
        createFocusSpanLink={createFocusSpanLink}
      />
    );
  }

  if (span.tags.some((tag) => tag.key === pyroscopeProfileIdTagKey)) {
    listOfContentCards.push(
      <SpanFlameGraph
        span={span}
        timeZone={timeZone}
        traceFlameGraphs={traceFlameGraphs}
        setTraceFlameGraphs={setTraceFlameGraphs}
        traceToProfilesOptions={traceToProfilesOptions}
        setRedrawListView={setRedrawListView}
        traceDuration={traceDuration}
        traceName={traceName}
      />
    );
  }

  return (
    <div data-testid="span-detail-component" ref={mainContainerRef} {...stylex.props(styles.spanDetailComponent)}>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.serviceNameAndLinks)}>
          <h6 {...stylex.props(styles.operationName)} title={operationName}>
            {operationName}
          </h6>
          {linksComponent}
        </div>
        <div {...stylex.props(styles.listWrapper)}>
          <LabeledList xstyle={styles.list} divider={false} items={overviewItems} color={color} />
        </div>
      </div>
      <div {...stylex.props(styles.content)}>
        <CardsContainer listOfContentCards={listOfContentCards} mainContainerRef={mainContainerRef} />

        <small {...stylex.props(styles.debugInfo)}>
          {/* TODO: fix keyboard a11y */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <a
            {...focusSpanLink}
            onClick={(e) => {
              // click handling logic copied from react router:
              // https://github.com/remix-run/react-router/blob/997b4d67e506d39ac6571cb369d6d2d6b3dda557/packages/react-router-dom/index.tsx#L392-L394s
              if (
                focusSpanLink.onClick &&
                e.button === 0 && // Ignore everything but left clicks
                (!e.currentTarget.target || e.currentTarget.target === '_self') && // Let browser handle "target=_blank" etc.
                !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) // Ignore clicks with modifier keys
              ) {
                e.preventDefault();
                focusSpanLink.onClick(e);
              }
            }}
          >
            <Icon name={'link'} xstyle={[alignIconStyles.alignIcon, styles.LinkIcon]}></Icon>
          </a>
          <span {...stylex.props(styles.debugLabel)} data-label="SpanID:" /> {spanID}
        </small>
      </div>
    </div>
  );
}

export const getAbsoluteTime = (startTime: number, timeZone: TimeZone) => {
  const dateStr = dateTimeFormat(startTime / 1000, { timeZone, defaultWithMS: true });
  const match = dateStr.split(' ');
  const absoluteTime = match[1] ? match[1] : dateStr;
  return ` (${absoluteTime})`;
};

const CardsContainer = ({
  listOfContentCards,
  mainContainerRef,
}: {
  listOfContentCards: React.ReactNode[];
  mainContainerRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  const useTwoColumns =
    mainContainerRef && mainContainerRef.current && mainContainerRef.current.getBoundingClientRect().width > 1000;

  if (useTwoColumns) {
    return (
      <>
        <div {...stylex.props(styles.columnLeft)}>
          {listOfContentCards.map((card, index) =>
            index % 2 === 0 ? (
              <div {...stylex.props(styles.card)} key={index}>
                {card}
              </div>
            ) : null
          )}
        </div>

        <div {...stylex.props(styles.columnRight)}>
          {listOfContentCards.map((card, index) =>
            index % 2 === 1 ? (
              <div {...stylex.props(styles.card)} key={index}>
                {card}
              </div>
            ) : null
          )}
        </div>
      </>
    );
  }

  return (
    <div {...stylex.props(styles.singleColumn)}>
      {listOfContentCards.map((card, index) => (
        <div {...stylex.props(styles.card)} key={index}>
          {card}
        </div>
      ))}
    </div>
  );
};

const styles = stylex.create({
  card: {
    // `:not(:empty)` border: an empty card (SpanFlameGraph without data) draws none.
    borderWidth: '1px',
    borderStyle: { default: 'solid', ':empty': 'none' },
    borderColor: { default: colors['--gf-colors-border-weak'], ':hover': colors['--gf-colors-border-strong'] },
    borderRadius: shape['--gf-shape-radius-md'],
    margin: '6px',
    padding: '5px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    rowGap: 0,
    columnGap: '1rem',
    marginBottom: '0.25rem',
    flexDirection: 'column',
  },
  content: {
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  listWrapper: {
    overflow: 'hidden',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  list: {
    textAlign: 'left',
  },
  spanDetailComponent: {
    display: 'flex',
    flexDirection: 'column', // On bigger screens display attributes below service name
  },
  serviceNameAndLinks: {
    display: 'flex',
    width: '100%',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  operationName: {
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '50%',
    flexGrow: 1,
    flexShrink: 0,
  },
  debugInfo: {
    display: 'block',
    letterSpacing: '0.25px',
    marginTop: '0.5em',
    marginRight: 0,
    marginBottom: '-0.75em',
    marginLeft: 0,
    textAlign: 'right',
    clear: 'both',
  },
  debugLabel: {
    '::before': {
      color: traceColors['--gf-trace-bbb'],
      content: 'attr(data-label)',
    },
  },
  LinkIcon: {
    fontSize: '1.5em',
  },
  columnLeft: {
    float: 'left',
    width: '50%',
  },
  columnRight: {
    float: 'right',
    width: '50%',
  },
  singleColumn: {
    clear: 'both',
    width: '100%',
  },
});
