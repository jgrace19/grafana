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
import { get as _get } from 'lodash';
import * as React from 'react';

import { Icon } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';

import { traceColors } from '../traceColors.stylex';
import { type TraceSpan } from '../types/trace';
import spanAncestorIds from '../utils/span-ancestor-ids';

export type TProps = {
  childrenVisible?: boolean;
  onClick?: () => void;
  span: TraceSpan;
  showChildrenIcon?: boolean;

  hoverIndentGuideIds: Set<string>;
  addHoverIndentGuideId: (spanID: string) => void;
  removeHoverIndentGuideId: (spanID: string) => void;
  visibleSpanIds: string[];
  removeLastIndentGuide?: boolean;
  /** @internal first-party StyleX overrides for the root */
  xstyle?: stylex.StyleXStyles;
  /** @internal first-party StyleX overrides for the expand/collapse icon wrapper */
  iconWrapperXstyle?: stylex.StyleXStyles;
};

const SpanTreeOffset = React.memo<TProps>((props) => {
  const {
    childrenVisible = false,
    showChildrenIcon = true,
    onClick,
    span,
    visibleSpanIds,
    hoverIndentGuideIds,
    addHoverIndentGuideId,
    removeHoverIndentGuideId,
    removeLastIndentGuide = false,
    xstyle,
    iconWrapperXstyle,
  } = props;

  const ancestorIds = React.useMemo(() => {
    const ids = spanAncestorIds(span);
    // Some traces have multiple root-level spans, this connects them all under one guideline and adds the
    // necessary padding for the collapse icon on root-level spans.
    ids.push('root');
    ids.reverse();

    if (removeLastIndentGuide) {
      ids.pop();
    }
    return ids;
  }, [span, removeLastIndentGuide]);

  /**
   * If the mouse leaves to anywhere except another span with the same ancestor id, this span's ancestor id is
   * removed from the set of hoverIndentGuideIds.
   *
   * @param {Object} event - React Synthetic event tied to mouseleave. Includes the related target which is
   *     the element the user is now hovering.
   * @param {string} ancestorId - The span id that the user was hovering over.
   */
  const handleMouseLeave = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement>, ancestorId: string) => {
      if (
        !(event.relatedTarget instanceof HTMLSpanElement) ||
        _get(event, 'relatedTarget.dataset.ancestorId') !== ancestorId
      ) {
        removeHoverIndentGuideId(ancestorId);
      }
    },
    [removeHoverIndentGuideId]
  );

  /**
   * If the mouse entered this span from anywhere except another span with the same ancestor id, this span's
   * ancestorId is added to the set of hoverIndentGuideIds.
   *
   * @param {Object} event - React Synthetic event tied to mouseenter. Includes the related target which is
   *     the last element the user was hovering.
   * @param {string} ancestorId - The span id that the user is now hovering over.
   */
  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement>, ancestorId: string) => {
      if (
        !(event.relatedTarget instanceof HTMLSpanElement) ||
        _get(event, 'relatedTarget.dataset.ancestorId') !== ancestorId
      ) {
        addHoverIndentGuideId(ancestorId);
      }
    },
    [addHoverIndentGuideId]
  );

  const { hasChildren, spanID } = span;
  const wrapperProps = hasChildren ? { onClick, role: 'switch', 'aria-checked': childrenVisible } : null;
  const icon =
    showChildrenIcon &&
    hasChildren &&
    (childrenVisible ? (
      <Icon name={'angle-down'} data-testid="icon-arrow-down" size={'sm'} />
    ) : (
      <Icon name={'angle-right'} data-testid="icon-arrow-right" size={'sm'} />
    ));

  return (
    <span
      {...stylex.props(styles.SpanTreeOffset, hasChildren && styles.SpanTreeOffsetParent, xstyle)}
      {...wrapperProps}
    >
      {ancestorIds.map((ancestorId, index) => (
        <span
          key={ancestorId}
          {...stylex.props(
            styles.indentGuide,
            hoverIndentGuideIds.has(ancestorId) && styles.indentGuideActive,
            index !== ancestorIds.length - 1 &&
              ancestorId !== 'root' &&
              !visibleSpanIds.includes(ancestorId) &&
              styles.indentGuideThin
          )}
          data-ancestor-id={ancestorId}
          data-active={hoverIndentGuideIds.has(ancestorId) || undefined}
          data-testid="SpanTreeOffset--indentGuide"
          onMouseEnter={(event) => handleMouseEnter(event, ancestorId)}
          onMouseLeave={(event) => handleMouseLeave(event, ancestorId)}
        />
      ))}
      <span
        {...stylex.props(styles.iconWrapper, iconWrapperXstyle)}
        onMouseEnter={(event) => icon && handleMouseEnter(event, spanID)}
        onMouseLeave={(event) => icon && handleMouseLeave(event, spanID)}
        data-testid="icon-wrapper"
      >
        {icon || (!removeLastIndentGuide && '-')}
      </span>
    </span>
  );
});

SpanTreeOffset.displayName = 'SpanTreeOffset';

export default SpanTreeOffset;

const styles = stylex.create({
  SpanTreeOffset: {
    color: traceColors['--gf-trace-000'],
    position: 'relative',
  },
  SpanTreeOffsetParent: {
    cursor: { default: null, ':hover': 'pointer' },
  },
  indentGuide: {
    /* The size of the indentGuide is based off of the iconWrapper */
    paddingRight: '1rem',
    height: '100%',
    display: 'inline-flex',
    transitionProperty: { default: null, [motion.noPreference]: 'padding' },
    transitionDuration: { default: null, [motion.noPreference]: '300ms' },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease-out' },
    '::before': {
      content: '""',
      paddingLeft: '1px',
      backgroundColor: traceColors['--gf-trace-lightgrey'],
    },
  },
  indentGuideActive: {
    '::before': {
      backgroundColor: traceColors['--gf-trace-777'],
    },
  },
  indentGuideThin: {
    paddingRight: '0.3rem',
  },
  iconWrapper: {
    position: 'absolute',
    right: 0,
    height: '100%',
    paddingTop: '1px',
    width: '1rem',
    textAlign: 'center',
  },
});
