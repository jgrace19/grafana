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
import { DURATION, NONE, TAG } from '@grafana/o11y-ds-frontend';
import { Icon, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape } from '@grafana/ui/stylex/tokens.stylex';

import { autoColor } from '../Theme';
import { spanBarRowMarker, spanNameMarker } from '../markers.stylex';
import { type SpanBarOptions } from '../settings/SpanBarSettings';
import { traceColors } from '../traceColors.stylex';
import type TNil from '../types/TNil';
import { type SpanLinkFunc } from '../types/links';
import { type TraceSpan, type CriticalPathSection } from '../types/trace';
import { formatDuration } from '../utils/date';
import { getServiceDisplayName } from '../utils/service-name';

import SpanBar from './SpanBar';
import { SpanLinksMenu } from './SpanLinks';
import SpanTreeOffset from './SpanTreeOffset';
import Ticks from './Ticks';
import TimelineRow from './TimelineRow';
import { type ViewedBoundsFunctionType } from './utils';

export type SpanBarRowProps = {
  className?: string;
  color: string;
  spanBarOptions: SpanBarOptions | undefined;
  columnDivision: number;
  isChildrenExpanded: boolean;
  isDetailExpanded: boolean;
  isMatchingFilter: boolean;
  isFocused: boolean;
  showSpanFilterMatchesOnly: boolean;
  onDetailToggled: (spanID: string) => void;
  onChildrenToggled: (spanID: string) => void;
  numTicks: number;
  showServiceName: boolean;
  rpc?:
    | {
        viewStart: number;
        viewEnd: number;
        color: string;
        operationName: string;
        serviceName: string;
      }
    | TNil;
  noInstrumentedServer?:
    | {
        color: string;
        serviceName: string;
      }
    | TNil;
  showErrorIcon: boolean;
  getViewedBounds: ViewedBoundsFunctionType;
  traceStartTime: number;
  span: TraceSpan;
  hoverIndentGuideIds: Set<string>;
  addHoverIndentGuideId: (spanID: string) => void;
  removeHoverIndentGuideId: (spanID: string) => void;
  clippingLeft?: boolean;
  clippingRight?: boolean;
  createSpanLink?: SpanLinkFunc;
  datasourceType: string;
  visibleSpanIds: string[];
  criticalPath: CriticalPathSection[];
};

const SpanBarRow = React.memo<SpanBarRowProps>((props) => {
  const {
    className = '',
    color,
    spanBarOptions,
    columnDivision,
    isChildrenExpanded,
    isDetailExpanded,
    isMatchingFilter,
    showSpanFilterMatchesOnly,
    isFocused,
    numTicks,
    rpc = null,
    noInstrumentedServer,
    showErrorIcon,
    getViewedBounds,
    traceStartTime,
    span,
    hoverIndentGuideIds,
    addHoverIndentGuideId,
    removeHoverIndentGuideId,
    clippingLeft,
    clippingRight,
    createSpanLink,
    datasourceType,
    showServiceName,
    visibleSpanIds,
    criticalPath,
    onDetailToggled,
    onChildrenToggled,
  } = props;
  const theme = useTheme2();

  const { duration, hasChildren: isParent, operationName, process } = span;
  const serviceDisplayName = getServiceDisplayName(process);
  const label = formatDuration(duration);

  const viewBounds = getViewedBounds(span.startTime, span.startTime + span.duration);
  const viewStart = viewBounds.start;
  const viewEnd = viewBounds.end;

  const labelDetail = `${serviceDisplayName}::${operationName}`;
  let longLabel;
  let labelPosition: 'left' | 'right';
  if (viewStart > 1 - viewEnd) {
    longLabel = `${labelDetail} | ${label}`;
    labelPosition = 'left';
  } else {
    longLabel = `${label} | ${labelDetail}`;
    labelPosition = 'right';
  }

  const hasMatchingFilterBackground = isMatchingFilter && !showSpanFilterMatchesOnly;
  const nameWrapperChild = showErrorIcon
    ? styles.nameWrapperChildError
    : hasMatchingFilterBackground
      ? styles.nameWrapperChildMatchingFilter
      : styles.nameWrapperChild;
  const serviceBorderColor = `${color}CF`;

  const handleDetailToggle = React.useCallback(() => {
    onDetailToggled(span.spanID);
  }, [onDetailToggled, span.spanID]);

  const handleChildrenToggle = React.useCallback(() => {
    onChildrenToggled(span.spanID);
  }, [onChildrenToggled, span.spanID]);

  const getSpanBarLabel = React.useCallback(
    (span: TraceSpan, spanBarOptions: SpanBarOptions | undefined, duration: string) => {
      const type = spanBarOptions?.type ?? '';

      if (type === NONE) {
        return '';
      } else if (type === '' || type === DURATION) {
        return `(${duration})`;
      } else if (type === TAG) {
        const tagKey = spanBarOptions?.tag?.trim() ?? '';
        if (tagKey !== '' && span.tags) {
          const tag = span.tags?.find((tag: TraceKeyValuePair) => {
            return tag.key === tagKey;
          });
          if (tag) {
            return `(${tag.value})`;
          }

          const process = span.process?.tags?.find((process: TraceKeyValuePair) => {
            return process.key === tagKey;
          });
          if (process) {
            return `(${process.value})`;
          }
        }
      }

      return '';
    },
    []
  );

  return (
    <TimelineRow
      className={mergeStylexProps(stylex.props(spanBarRowMarker), { className }).className}
      xstyle={[styles.row, isFocused && styles.rowFocused]}
    >
      <TimelineRow.Cell
        xstyle={[styles.nameColumn, clippingLeft && styles.nameColumnClippingLeft]}
        width={columnDivision}
      >
        <div
          {...stylex.props(
            styles.nameWrapper,
            nameWrapperBackground(isDetailExpanded, isMatchingFilter, showErrorIcon, hasMatchingFilterBackground),
            isDetailExpanded && styles.nameWrapperExpanded
          )}
        >
          <SpanTreeOffset
            onClick={isParent ? handleChildrenToggle : undefined}
            childrenVisible={isChildrenExpanded}
            span={span}
            hoverIndentGuideIds={hoverIndentGuideIds}
            addHoverIndentGuideId={addHoverIndentGuideId}
            removeHoverIndentGuideId={removeHoverIndentGuideId}
            visibleSpanIds={visibleSpanIds}
            xstyle={nameWrapperChild}
            iconWrapperXstyle={styles.iconWrapperBorder(serviceBorderColor)}
          />
          <button
            type="button"
            {...stylex.props(
              styles.name,
              spanNameMarker,
              nameWrapperChild,
              styles.nameBorder(serviceBorderColor),
              isDetailExpanded && styles.nameDetailExpanded
            )}
            aria-checked={isDetailExpanded}
            title={labelDetail}
            onClick={handleDetailToggle}
            role="switch"
            tabIndex={0}
          >
            {showErrorIcon && (
              <Icon
                name={'exclamation-circle'}
                style={{
                  backgroundColor: span.errorIconColor
                    ? autoColor(theme, span.errorIconColor)
                    : autoColor(theme, '#db2828'),
                }}
                xstyle={styles.errorIcon}
              />
            )}
            {showServiceName && (
              <span
                {...stylex.props(styles.svcName, isParent && !isChildrenExpanded && styles.svcNameChildrenCollapsed)}
              >
                {`${serviceDisplayName} `}
              </span>
            )}
            {rpc && (
              <span>
                <Icon name={'arrow-right'} />{' '}
                <i {...mergeStylexProps(stylex.props(styles.rpcColorMarker), { style: { background: rpc.color } })} />
                {rpc.serviceName}
              </span>
            )}
            {noInstrumentedServer && (
              <span>
                <Icon name={'arrow-right'} />{' '}
                <i
                  {...mergeStylexProps(stylex.props(styles.rpcColorMarker), {
                    style: { background: noInstrumentedServer.color },
                  })}
                />
                {noInstrumentedServer.serviceName}
              </span>
            )}
            <span {...stylex.props(styles.endpointName)}>{rpc ? rpc.operationName : operationName}</span>
            <span {...stylex.props(styles.endpointName)}> {getSpanBarLabel(span, spanBarOptions, label)}</span>
          </button>
          {createSpanLink &&
            (() => {
              const links = createSpanLink(span);
              const count = links?.length || 0;
              if (links && count === 1) {
                if (!links[0]) {
                  return null;
                }

                return (
                  <a
                    href={links[0].href}
                    // Needs to have target otherwise preventDefault would not work due to angularRouter.
                    target={'_blank'}
                    {...mergeStylexProps(stylex.props(nameWrapperChild), {
                      style: {
                        borderBottom: `2px solid ${serviceBorderColor}`,
                        paddingInline: '4px',
                      },
                    })}
                    rel="noopener noreferrer"
                    onClick={
                      links[0].onClick
                        ? (event) => {
                            if (!(event.ctrlKey || event.metaKey || event.shiftKey) && links[0].onClick) {
                              event.preventDefault();
                              links[0].onClick(event);
                            }
                          }
                        : undefined
                    }
                  >
                    {links[0].content}
                  </a>
                );
              } else if (links && count > 1) {
                return (
                  <SpanLinksMenu
                    links={links}
                    datasourceType={datasourceType}
                    color={color}
                    xstyle={nameWrapperChild}
                  />
                );
              } else {
                return null;
              }
            })()}
        </div>
      </TimelineRow.Cell>
      <TimelineRow.Cell
        xstyle={[
          styles.view,
          viewBackground(isDetailExpanded, isMatchingFilter, isFocused),
          isDetailExpanded ? styles.viewOutlineExpanded : styles.viewOutline,
          isFocused && styles.viewFocused,
          clippingRight && styles.viewClippingRight,
        ]}
        data-testid="span-view"
        style={{ cursor: 'pointer' }}
        width={1 - columnDivision}
        onClick={handleDetailToggle}
      >
        <Ticks numTicks={numTicks} />
        <SpanBar
          criticalPath={criticalPath}
          rpc={rpc}
          viewStart={viewStart}
          viewEnd={viewEnd}
          getViewedBounds={getViewedBounds}
          color={color}
          shortLabel={label}
          longLabel={longLabel}
          traceStartTime={traceStartTime}
          span={span}
          labelPosition={labelPosition}
          isLabelHighlighted={isDetailExpanded || isFocused}
        />
      </TimelineRow.Cell>
    </TimelineRow>
  );
});

SpanBarRow.displayName = 'SpanBarRow';

export default SpanBarRow;

/*
 * The row's background rules resolved per state. Emotion applied them as descendant selectors of the row
 * (`.row:hover .nameWrapper`, `.rowExpanded .nameWrapper`, ...); where two had equal specificity, the later
 * one in the old stylesheet won: error beats matching-filter beats expanded beats the plain row hover.
 */
function nameWrapperBackground(
  isExpanded: boolean,
  isMatchingFilter: boolean,
  isError: boolean,
  hasMatchingFilterBackground: boolean
) {
  const rest = isExpanded
    ? isMatchingFilter
      ? traceColors['--gf-trace-fff3d7']
      : traceColors['--gf-trace-f0f0f0']
    : hasMatchingFilterBackground
      ? traceColors['--gf-trace-fffce4']
      : null;
  if (isError) {
    return styles.nameWrapperBackground(rest, colors['--gf-colors-error-border-transparent']);
  }
  if (isMatchingFilter) {
    return [styles.nameWrapperBackground(rest, 'transparent'), styles.nameWrapperHoverMatchingFilter];
  }
  if (isExpanded) {
    return styles.nameWrapperBackground(rest, traceColors['--gf-trace-f0f0f0']);
  }
  return [styles.nameWrapperBackground(rest, 'transparent'), styles.nameWrapperHover];
}

function viewBackground(isExpanded: boolean, isMatchingFilter: boolean, isFocused: boolean) {
  const rest = isFocused
    ? traceColors['--gf-trace-cbe7ff']
    : isExpanded
      ? isMatchingFilter
        ? traceColors['--gf-trace-fff3d7']
        : traceColors['--gf-trace-f8f8f8']
      : null;
  const hover =
    isExpanded && isMatchingFilter
      ? traceColors['--gf-trace-ffeccf']
      : isMatchingFilter
        ? traceColors['--gf-trace-f7f1c6']
        : isExpanded
          ? traceColors['--gf-trace-eee']
          : traceColors['--gf-trace-f5f5f5'];
  return styles.viewBackground(rest, hover);
}

const flash = stylex.keyframes({
  from: {
    backgroundColor: traceColors['--gf-trace-68b9ff'],
  },
  to: {},
});

const styles = stylex.create({
  nameWrapper: {
    lineHeight: '27px',
    overflow: 'hidden',
    display: 'flex',
  },
  nameWrapperBackground: (rest: string | null, hover: string) => ({
    backgroundColor: { default: rest, [stylex.when.ancestor(':hover', spanBarRowMarker)]: hover },
  }),
  nameWrapperHover: {
    backgroundImage: {
      default: null,
      [stylex.when.ancestor(':hover', spanBarRowMarker)]:
        `linear-gradient(90deg, ${traceColors['--gf-trace-fafafa']}, ${traceColors['--gf-trace-f8f8f8']} 75%, ${traceColors['--gf-trace-eee']})`,
    },
  },
  nameWrapperHoverMatchingFilter: {
    backgroundImage: {
      default: null,
      [stylex.when.ancestor(':hover', spanBarRowMarker)]:
        `linear-gradient(90deg, ${traceColors['--gf-trace-fffbde']}, ${traceColors['--gf-trace-fffbde']} 75%, ${traceColors['--gf-trace-f7f1c6']})`,
    },
  },
  nameWrapperExpanded: {
    boxShadow: `0 1px 0 ${traceColors['--gf-trace-ddd']}`,
  },
  // `.nameWrapper > *`: the wrapper's children.
  nameWrapperChild: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  nameWrapperChildMatchingFilter: {
    backgroundColor: traceColors['--gf-trace-fffce4'],
  },
  nameWrapperChildError: {
    backgroundColor: colors['--gf-colors-error-transparent'],
  },
  nameColumn: {
    position: 'relative',
    whiteSpace: 'nowrap',
    zIndex: 1,
  },
  nameColumnClippingLeft: {
    '::before': {
      content: '" "',
      height: '100%',
      position: 'absolute',
      width: '6px',
      backgroundImage: `linear-gradient(to right, ${traceColors['--gf-trace-rgba-25-25-25-0-25']}, ${traceColors['--gf-trace-rgba-32-32-32-0']})`,
      left: '100%',
      zIndex: -1,
    },
  },
  endpointName: {
    color: {
      default: traceColors['--gf-trace-484848'],
      [stylex.when.ancestor(':hover', spanNameMarker)]: traceColors['--gf-trace-000'],
    },
    fontSize: '0.9em',
  },
  view: {
    position: 'relative',
  },
  viewBackground: (rest: string | null, hover: string) => ({
    backgroundColor: { default: rest, [stylex.when.ancestor(':hover', spanBarRowMarker)]: hover },
  }),
  viewOutline: {
    outlineWidth: { default: null, [stylex.when.ancestor(':hover', spanBarRowMarker)]: '1px' },
    outlineStyle: { default: null, [stylex.when.ancestor(':hover', spanBarRowMarker)]: 'solid' },
    outlineColor: { default: null, [stylex.when.ancestor(':hover', spanBarRowMarker)]: traceColors['--gf-trace-ddd'] },
  },
  viewOutlineExpanded: {
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: traceColors['--gf-trace-ddd'],
  },
  viewFocused: {
    animationName: { default: null, [motion.noPreference]: flash },
    animationDuration: { default: null, [motion.noPreference]: '1s' },
    animationTimingFunction: { default: null, [motion.noPreference]: 'cubic-bezier(0.12, 0, 0.39, 0)' },
  },
  viewClippingRight: {
    '::before': {
      content: '" "',
      height: '100%',
      position: 'absolute',
      width: '6px',
      backgroundImage: `linear-gradient(to left, ${traceColors['--gf-trace-rgba-25-25-25-0-25']}, ${traceColors['--gf-trace-rgba-25-25-25-0-25']})`,
      right: '0%',
      zIndex: 1,
    },
  },
  row: {
    fontSize: '0.9em',
  },
  rowFocused: {
    animationName: { default: null, [motion.noPreferenceOrReduce]: flash },
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '1s' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.12, 0, 0.39, 0)' },
  },
  iconWrapperBorder: (borderColor: string) => ({
    borderBottomColor: borderColor,
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
  }),
  name: {
    color: traceColors['--gf-trace-000'],
    cursor: 'pointer',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    outlineStyle: 'none',
    overflowY: 'hidden',
    overflowX: 'auto',
    padding: '4px',
    position: 'relative',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    textDecoration: { default: null, ':focus': 'none' },
    textAlign: 'left',
    borderStyle: 'none',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
  },
  nameBorder: (borderColor: string) => ({
    borderBottomColor: borderColor,
  }),
  nameDetailExpanded: {
    '::before': {
      bottom: 0,
    },
  },
  svcName: {
    fontSize: '0.9em',
    fontWeight: 500,
    marginRight: '0.25rem',
  },
  svcNameChildrenCollapsed: {
    fontWeight: 500,
    fontStyle: 'italic',
  },
  errorIcon: {
    borderRadius: shape['--gf-shape-radius-md'],
    color: traceColors['--gf-trace-fff'],
    fontSize: '0.6em',
    marginRight: '0.25rem',
    padding: '1px',
  },
  rpcColorMarker: {
    borderRadius: shape['--gf-shape-radius-md'],
    display: 'inline-block',
    fontSize: '0.85em',
    height: '1em',
    marginRight: '0.25rem',
    padding: '1px',
    width: '1em',
    verticalAlign: 'middle',
  },
});
