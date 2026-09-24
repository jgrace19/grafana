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
import React from 'react';

import { type CoreApp, type LinkModel, type TimeRange, type TraceLog } from '@grafana/data';
import { type TraceToProfilesOptions } from '@grafana/o11y-ds-frontend';
import { type TimeZone } from '@grafana/schema';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { type SpanLinkFunc } from '../types/links';
import { type TraceSpan, type TraceSpanReference } from '../types/trace';

import SpanDetail, { type TraceFlameGraphs } from './SpanDetail';
import type DetailState from './SpanDetail/DetailState';
import SpanTreeOffset from './SpanTreeOffset';
import TimelineRow from './TimelineRow';

export type SpanDetailRowProps = {
  color: string;
  columnDivision: number;
  detailState: DetailState;
  onDetailToggled: (spanID: string) => void;
  logItemToggle: (spanID: string, log: TraceLog) => void;
  logsToggle: (spanID: string) => void;
  processToggle: (spanID: string) => void;
  referenceItemToggle: (spanID: string, reference: TraceSpanReference) => void;
  referencesToggle: (spanID: string) => void;
  warningsToggle: (spanID: string) => void;
  stackTracesToggle: (spanID: string) => void;
  span: TraceSpan;
  traceToProfilesOptions?: TraceToProfilesOptions;
  timeZone: TimeZone;
  tagsToggle: (spanID: string) => void;
  traceStartTime: number;
  traceDuration: number;
  traceName: string;
  hoverIndentGuideIds: Set<string>;
  addHoverIndentGuideId: (spanID: string) => void;
  removeHoverIndentGuideId: (spanID: string) => void;
  createSpanLink?: SpanLinkFunc;
  focusedSpanId?: string;
  createFocusSpanLink: (traceId: string, spanId: string) => LinkModel;
  datasourceType: string;
  datasourceUid: string;
  visibleSpanIds: string[];
  traceFlameGraphs: TraceFlameGraphs;
  setTraceFlameGraphs: (flameGraphs: TraceFlameGraphs) => void;
  setRedrawListView: (redraw: {}) => void;
  timeRange: TimeRange;
  app: CoreApp;
};

const SpanDetailRow = React.memo<SpanDetailRowProps>((props) => {
  const {
    color,
    detailState,
    logItemToggle,
    logsToggle,
    processToggle,
    referenceItemToggle,
    referencesToggle,
    warningsToggle,
    stackTracesToggle,
    span,
    traceToProfilesOptions,
    timeZone,
    tagsToggle,
    traceStartTime,
    traceDuration,
    traceName,
    createSpanLink,
    focusedSpanId,
    createFocusSpanLink,
    datasourceType,
    datasourceUid,
    traceFlameGraphs,
    setTraceFlameGraphs,
    setRedrawListView,
    timeRange,
    app,
    hoverIndentGuideIds,
    addHoverIndentGuideId,
    removeHoverIndentGuideId,
    visibleSpanIds,
  } = props;

  return (
    <TimelineRow>
      <TimelineRow.Cell width={1} xstyle={styles.cell}>
        <div {...stylex.props(styles.indentSpacer)}>
          <SpanTreeOffset
            span={span}
            showChildrenIcon={false}
            hoverIndentGuideIds={hoverIndentGuideIds}
            addHoverIndentGuideId={addHoverIndentGuideId}
            removeHoverIndentGuideId={removeHoverIndentGuideId}
            visibleSpanIds={visibleSpanIds}
            removeLastIndentGuide={true}
          />
        </div>
        <div {...stylex.props(styles.detailWrapper)}>
          <div {...mergeStylexProps(stylex.props(styles.infoWrapper), { style: { borderTopColor: color } })}>
            <SpanDetail
              color={color}
              detailState={detailState}
              logItemToggle={logItemToggle}
              logsToggle={logsToggle}
              processToggle={processToggle}
              referenceItemToggle={referenceItemToggle}
              referencesToggle={referencesToggle}
              warningsToggle={warningsToggle}
              stackTracesToggle={stackTracesToggle}
              span={span}
              traceToProfilesOptions={traceToProfilesOptions}
              timeZone={timeZone}
              tagsToggle={tagsToggle}
              traceStartTime={traceStartTime}
              traceDuration={traceDuration}
              traceName={traceName}
              createSpanLink={createSpanLink}
              focusedSpanId={focusedSpanId}
              createFocusSpanLink={createFocusSpanLink}
              datasourceType={datasourceType}
              datasourceUid={datasourceUid}
              traceFlameGraphs={traceFlameGraphs}
              setTraceFlameGraphs={setTraceFlameGraphs}
              setRedrawListView={setRedrawListView}
              timeRange={timeRange}
              app={app}
            />
          </div>
        </div>
      </TimelineRow.Cell>
    </TimelineRow>
  );
});

SpanDetailRow.displayName = 'SpanDetailRow';

export default SpanDetailRow;

const styles = stylex.create({
  infoWrapper: {
    padding: '0.75rem',
  },
  cell: {
    display: 'flex',
    width: '100%',
  },
  indentSpacer: {
    flex: 'none',
  },
  detailWrapper: {
    flex: '1',
    minWidth: 0,
    backgroundColor: colors['--gf-colors-background-canvas'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
  },
});
