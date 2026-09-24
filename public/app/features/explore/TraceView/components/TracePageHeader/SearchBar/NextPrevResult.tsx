// Copyright (c) 2018 Uber Technologies, Inc.
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
import { get, maxBy, values } from 'lodash';
import { memo, type Dispatch, type SetStateAction, useEffect, useCallback } from 'react';
import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { Button, Icon, type PopoverContent, Tooltip } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type Trace } from '../../types/trace';
import { getServiceDisplayName } from '../../utils/service-name';

export type NextPrevResultProps = {
  trace: Trace;
  spanFilterMatches: Set<string> | undefined;
  setFocusedSpanIdForSearch: Dispatch<SetStateAction<string>>;
  focusedSpanIndexForSearch: number;
  setFocusedSpanIndexForSearch: Dispatch<SetStateAction<number>>;
  datasourceType: string;
  showSpanFilters: boolean;
};

export default memo(function NextPrevResult(props: NextPrevResultProps) {
  const {
    trace,
    spanFilterMatches,
    setFocusedSpanIdForSearch,
    focusedSpanIndexForSearch,
    setFocusedSpanIndexForSearch,
    datasourceType,
  } = props;

  useEffect(() => {
    if (spanFilterMatches && focusedSpanIndexForSearch !== -1) {
      const spanMatches = Array.from(spanFilterMatches!);
      setFocusedSpanIdForSearch(spanMatches[focusedSpanIndexForSearch]);
    }
  }, [focusedSpanIndexForSearch, setFocusedSpanIdForSearch, spanFilterMatches]);

  const nextResult = (event: React.UIEvent, buttonEnabled: boolean) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonEnabled) {
      reportInteraction('grafana_traces_trace_view_find_next_prev_clicked', {
        datasourceType: datasourceType,
        grafana_version: config.buildInfo.version,
        direction: 'next',
      });

      // new query || at end, go to start
      if (
        focusedSpanIndexForSearch === -1 ||
        (spanFilterMatches && focusedSpanIndexForSearch === spanFilterMatches.size - 1)
      ) {
        setFocusedSpanIndexForSearch(0);
        return;
      }

      // get next
      setFocusedSpanIndexForSearch(focusedSpanIndexForSearch + 1);
    }
  };

  const prevResult = (event: React.UIEvent, buttonEnabled: boolean) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonEnabled) {
      reportInteraction('grafana_traces_trace_view_find_next_prev_clicked', {
        datasourceType: datasourceType,
        grafana_version: config.buildInfo.version,
        direction: 'prev',
      });

      // new query || at start, go to end
      if (spanFilterMatches && (focusedSpanIndexForSearch === -1 || focusedSpanIndexForSearch === 0)) {
        setFocusedSpanIndexForSearch(spanFilterMatches.size - 1);
        return;
      }

      // get prev
      setFocusedSpanIndexForSearch(focusedSpanIndexForSearch - 1);
    }
  };

  const nextResultOnKeyDown = (event: React.KeyboardEvent, buttonEnabled: boolean) => {
    if (event.key === 'Enter') {
      nextResult(event, buttonEnabled);
    }
  };

  const prevResultOnKeyDown = (event: React.KeyboardEvent, buttonEnabled: boolean) => {
    if (event.key === 'Enter') {
      prevResult(event, buttonEnabled);
    }
  };

  const buttonEnabled = (spanFilterMatches && spanFilterMatches?.size > 0) ?? false;

  const getTooltip = useCallback((content: PopoverContent) => {
    return (
      <Tooltip content={content} placement="top">
        <span {...stylex.props(styles.tooltip)} data-testid="next-prev-result-tooltip">
          <Icon name="info-circle" size="sm" />
        </span>
      </Tooltip>
    );
  }, []);

  const getMatchesMetadata = useCallback(
    (depth: number, services: number) => {
      let metadata = (
        <>
          <span>{`${trace.spans.length} spans`}</span>
          {getTooltip(
            <>
              <div>
                <Trans i18nKey="explore.next-prev-result.services">Services: {{ services }}</Trans>
              </div>
              <div>
                <Trans i18nKey="explore.next-prev-result.depth">Depth: {{ depth }}</Trans>
              </div>
            </>
          )}
        </>
      );

      if (spanFilterMatches) {
        if (spanFilterMatches.size === 0) {
          metadata = (
            <>
              <span>
                <Trans i18nKey="explore.get-matches-metadata.matches">0 matches</Trans>
              </span>
              {getTooltip(
                'There are 0 span matches for the filters selected. Please try removing some of the selected filters.'
              )}
            </>
          );
        } else {
          const type = spanFilterMatches.size === 1 ? 'match' : 'matches';
          const text =
            focusedSpanIndexForSearch !== -1
              ? `${focusedSpanIndexForSearch + 1}/${spanFilterMatches.size} ${type}`
              : `${spanFilterMatches.size} ${type}`;

          const matchedServices: string[] = [];
          spanFilterMatches.forEach((spanID) => {
            if (trace.processes[spanID]) {
              matchedServices.push(getServiceDisplayName(trace.processes[spanID]));
            }
          });

          metadata = (
            <>
              <span>{text}</span>
              {getTooltip(
                <>
                  <div>
                    <Trans
                      i18nKey="explore.next-prev-result.services-span-filter-matches"
                      values={{ total: new Set(matchedServices).size }}
                    >
                      Services: {'{{total}}'}/{{ services }}
                    </Trans>
                  </div>
                  <div>
                    <Trans i18nKey="explore.next-prev-result.depth-span-filter-matches">Depth: {{ depth }}</Trans>
                  </div>
                </>
              )}
            </>
          );
        }
      }

      return metadata;
    },
    [focusedSpanIndexForSearch, getTooltip, spanFilterMatches, trace.processes, trace.spans]
  );

  const services = new Set(values(trace.processes).map((p) => getServiceDisplayName(p))).size;
  const depth = get(maxBy(trace.spans, 'depth'), 'depth', 0) + 1;

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.buttons, !buttonEnabled && styles.buttonsDisabled)}>
        <Button
          aria-label={t('explore.next-prev-result.aria-label-prev', 'Prev result button')}
          variant="secondary"
          size="md"
          icon="arrow-up"
          disabled={!buttonEnabled}
          onClick={(event) => prevResult(event, buttonEnabled)}
          onKeyDown={(event) => prevResultOnKeyDown(event, buttonEnabled)}
          tabIndex={buttonEnabled ? 0 : -1}
        />
        <Button
          aria-label={t('explore.next-prev-result.aria-label-next', 'Next result button')}
          variant="secondary"
          size="md"
          icon="arrow-down"
          disabled={!buttonEnabled}
          onClick={(event) => nextResult(event, buttonEnabled)}
          onKeyDown={(event) => nextResultOnKeyDown(event, buttonEnabled)}
          role="button"
          tabIndex={buttonEnabled ? 0 : -1}
        />
      </div>
      <span {...stylex.props(styles.matches)}>{getMatchesMetadata(depth, services)}</span>
    </div>
  );
});

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
  },
  buttons: {
    display: 'inline-flex',
    gap: 1,
  },
  buttonsDisabled: {
    cursor: 'not-allowed',
  },
  matches: {
    textWrap: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors['--gf-colors-text-primary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
  tooltip: {
    color: '#aaa',
    marginLeft: spacing['--gf-spacing-x0-5'],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
