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
import { tracePageHeaderStyles } from './TracePageHeader.stylex';
import { memo, useEffect, useMemo, useState } from 'react';
import * as React from 'react';

import {
  type CoreApp,
  type TraceSearchProps,
  type DataFrame,
  dateTimeFormat,
  dateTimeFormatTimeAgo,
  type GrafanaTheme2,
  PluginExtensionPoints,
} from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import {
  reportInteraction,
  renderLimitedComponents,
  usePluginComponents,
  usePluginLinks,
  config,
} from '@grafana/runtime';
import { AdHocFiltersComboboxRenderer } from '@grafana/scenes';
import { type TimeZone } from '@grafana/schema';
import {
  Badge,
  type BadgeColor,
  Button,
  ButtonGroup,
  CollapsableSection,
  Dropdown,
  Icon,
  Label,
  LinkButton,
  Menu,
  Tooltip,
  useTheme2,
} from '@grafana/ui';
import { useAppNotification } from 'app/core/copy/appNotification';

import { downloadTraceAsJson } from '../../../../inspector/utils/download';
import {
  type ViewRangeTimeUpdate,
  type TUpdateViewRangeTimeFunction,
  type ViewRange,
} from '../TraceTimelineViewer/types';
import { getHeaderTags, getTraceName } from '../model/trace-viewer';
import { type Trace, type TraceViewPluginExtensionContext } from '../types/trace';
import { formatDuration } from '../utils/date';
import { getServiceColorKey } from '../utils/service-name';

import TracePageSearchBar from './SearchBar/TracePageSearchBar';
import SpanGraph from './SpanGraph';
import { TraceFilterPills } from './TraceFilterPills';
import { useTraceAdHocFiltersController } from './useTraceAdHocFiltersController';

export type TracePageHeaderProps = {
  trace: Trace | null;
  data: DataFrame;
  app?: CoreApp;
  timeZone: TimeZone;
  search: TraceSearchProps;
  setSearch: (newSearch: TraceSearchProps) => void;
  showSpanFilters: boolean;
  setShowSpanFilters: (isOpen: boolean) => void;
  setFocusedSpanIdForSearch: React.Dispatch<React.SetStateAction<string>>;
  spanFilterMatches: Set<string> | undefined;
  datasourceType: string;
  datasourceName: string;
  datasourceUid: string;
  setHeaderHeight: (height: number) => void;
  updateNextViewRangeTime: (update: ViewRangeTimeUpdate) => void;
  updateViewRangeTime: TUpdateViewRangeTimeFunction;
  viewRange: ViewRange;
  hideHeaderDetails?: boolean;
};

export const TracePageHeader = memo((props: TracePageHeaderProps) => {
  const {
    trace,
    data,
    app,
    timeZone,
    search,
    setSearch,
    showSpanFilters,
    setFocusedSpanIdForSearch,
    spanFilterMatches,
    datasourceType,
    datasourceName,
    datasourceUid,
    setHeaderHeight,
    updateNextViewRangeTime,
    updateViewRangeTime,
    viewRange,
    hideHeaderDetails = false,
  } = props;
  const theme = useTheme2();
  const notifyApp = useAppNotification();
  const [copyTraceIdClicked, setCopyTraceIdClicked] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [focusedSpanIndexForSearch, setFocusedSpanIndexForSearch] = useState(-1);

  // Create controller for adhoc filters
  const controller = useTraceAdHocFiltersController(trace, search, setSearch);

  useEffect(() => {
    setHeaderHeight(document.querySelector('.' + mergeStylexClassName(stylex.props(tracePageHeaderStyles.header), undefined).className)?.scrollHeight ?? 0);
  }, [setHeaderHeight, showSpanFilters, mergeStylexClassName(stylex.props(tracePageHeaderStyles.header), undefined).className]);

  // Build context for plugin extensions if trace is available
  const traceContext: TraceViewPluginExtensionContext | undefined = trace
    ? {
        ...trace,
        datasource: {
          name: datasourceName,
          uid: datasourceUid,
          type: datasourceType,
        },
      }
    : undefined;

  const { links: extensionLinks } = usePluginLinks({
    extensionPointId: PluginExtensionPoints.TraceViewHeaderActions,
    context: traceContext,
    limitPerPlugin: 2,
  });

  const { components: extensionComponents } = usePluginComponents<TraceViewPluginExtensionContext>({
    extensionPointId: PluginExtensionPoints.TraceViewHeaderActions,
  });

  // Memoize service count to avoid recomputing on every render
  // Uses getServiceColorKey to count namespace/serviceName pairs as distinct services
  const serviceCount = useMemo(() => {
    return new Set(trace?.spans.map((span) => (span.process ? getServiceColorKey(span.process) : ''))).size;
  }, [trace?.spans]);

  if (!trace) {
    return null;
  }

  const { method, status, url } = getHeaderTags(trace.spans);
  const traceName = getTraceName(trace.spans);

  // Convert date from micro to milli seconds
  const formattedTimestamp = dateTimeFormat(trace.startTime / 1000, { timeZone, defaultWithMS: true });

  let statusColor: BadgeColor = 'green';
  if (status && status.length > 0) {
    if (status[0].value.toString().charAt(0) === '4') {
      statusColor = 'orange';
    } else if (status[0].value.toString().charAt(0) === '5') {
      statusColor = 'red';
    }
  }

  const copyTraceId = () => {
    navigator.clipboard.writeText(trace.traceID);
    setCopyTraceIdClicked(true);
    setTimeout(() => {
      setCopyTraceIdClicked(false);
    }, 5000);
  };

  const exportTrace = () => {
    const traceFormat = downloadTraceAsJson(data, 'Trace-' + trace.traceID.substring(trace.traceID.length - 6));
    reportInteraction('grafana_traces_download_traces_clicked', {
      app,
      grafana_version: config.buildInfo.version,
      trace_format: traceFormat,
      location: 'trace-view',
    });
  };

  const shareDropdownMenu = (
    <Menu>
      <Menu.Item
        label={t('explore.trace-page-header.share-copy-link', 'Copy link')}
        icon="link"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          notifyApp.success(t('explore.trace-page-header.link-copied', 'Link copied to clipboard'));
        }}
      />
      <Menu.Item
        label={t('explore.trace-page-header.share-export-json', 'Export as JSON')}
        icon="download-alt"
        onClick={() => {
          exportTrace();
          notifyApp.success(t('explore.trace-page-header.export-started', 'Export started'));
        }}
      />
    </Menu>
  );

  return (
    <header {...stylex.props(tracePageHeaderStyles.header)}>
      {/* Main title row */}
      <div {...stylex.props(tracePageHeaderStyles.titleRow)}>
        <div {...stylex.props(tracePageHeaderStyles.titleSection)}>
          <h1 {...stylex.props(tracePageHeaderStyles.title)}>{traceName}</h1>
          <div {...stylex.props(tracePageHeaderStyles.badges)}>
            {method && method.length > 0 && <Badge text={method[0].value} color="blue" />}
            {status && status.length > 0 && <Badge text={status[0].value} color={statusColor} />}
          </div>
        </div>

        {/* Action buttons */}
        {!hideHeaderDetails && (
          <div {...stylex.props(tracePageHeaderStyles.actions)}>
            {/* Plugin extension actions */}
            {extensionLinks.length > 0 && (
              <div {...stylex.props(tracePageHeaderStyles.actions)}>
                {extensionLinks.map((link) => (
                  <Tooltip key={link.id} content={link.description || link.title}>
                    <Button
                      size="sm"
                      variant="primary"
                      fill="outline"
                      icon={link.icon}
                      onClick={(event) => {
                        if (link.path) {
                          window.open(link.path, '_blank');
                        }
                        link.onClick?.(event);
                      }}
                    >
                      {link.title}
                    </Button>
                  </Tooltip>
                ))}
              </div>
            )}

            <div {...stylex.props(tracePageHeaderStyles.actions)}>
              {traceContext
                ? renderLimitedComponents<TraceViewPluginExtensionContext>({
                    props: traceContext,
                    components: extensionComponents,
                    limit: 2,
                  })
                : null}
            </div>

            {config.feedbackLinksEnabled && (
              <Tooltip
                content={t(
                  'explore.trace-page-header.title-share-thoughts-about-tracing-grafana',
                  'Share your thoughts about tracing in Grafana.'
                )}
              >
                <LinkButton
                  size="sm"
                  variant="secondary"
                  fill="outline"
                  icon="comment-alt-message"
                  href="https://forms.gle/RZDEx8ScyZNguDoC8"
                  target="_blank"
                >
                  <Trans i18nKey="explore.trace-page-header.give-feedback">Feedback</Trans>
                </LinkButton>
              </Tooltip>
            )}

            <ButtonGroup>
              <Tooltip content={t('explore.trace-page-header.share-tooltip', 'Share trace')}>
                <Button
                  size="sm"
                  variant="secondary"
                  fill="outline"
                  icon="share-alt"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    notifyApp.success(t('explore.trace-page-header.link-copied', 'Link copied to clipboard'));
                  }}
                >
                  {t('explore.trace-page-header.share', 'Share')}
                </Button>
              </Tooltip>

              <Dropdown overlay={shareDropdownMenu} placement="bottom-end">
                <Button
                  aria-label={t('explore.trace-page-header.aria-label-share-dropdown', 'Open share trace options menu')}
                  size="sm"
                  variant="secondary"
                  fill="outline"
                  icon="angle-down"
                />
              </Dropdown>
            </ButtonGroup>
          </div>
        )}
      </div>

      {/* Metadata row */}
      {!hideHeaderDetails && (
        <>
          <div {...stylex.props(tracePageHeaderStyles.metadataRow)}>
            <div {...stylex.props(tracePageHeaderStyles.metadataItem)}>
              <span {...stylex.props(tracePageHeaderStyles.metadataLabel)}>{t('explore.trace-page-header.trace-id', 'Trace ID')}</span>
              <span {...stylex.props(tracePageHeaderStyles.metadataValue)}>
                <button {...stylex.props(tracePageHeaderStyles.traceIdButton)} onClick={copyTraceId}>
                  {trace.traceID}
                  <Icon name={copyTraceIdClicked ? 'check' : 'copy'} size="sm" {...stylex.props(tracePageHeaderStyles.copyIcon)} />
                </button>
              </span>
            </div>

            <div {...stylex.props(tracePageHeaderStyles.metadataItem)}>
              <span {...stylex.props(tracePageHeaderStyles.metadataLabel)}>{t('explore.trace-page-header.start-time', 'Start time')}</span>
              <span
                className={clsx(
                  mergeStylexClassName(stylex.props(tracePageHeaderStyles.metadataValue), undefined).className,
                  css({
                    gap: theme.spacing(0.5),
                  })
                )}
              >
                <span>{formattedTimestamp}</span>
                <span {...stylex.props(tracePageHeaderStyles.timestampDetail)}>({dateTimeFormatTimeAgo(trace.startTime / 1000)})</span>
              </span>
            </div>

            <div {...stylex.props(tracePageHeaderStyles.metadataItem)}>
              <span {...stylex.props(tracePageHeaderStyles.metadataLabel)}>{t('explore.trace-page-header.duration', 'Duration')}</span>
              <span {...stylex.props(tracePageHeaderStyles.metadataValue)}>{formatDuration(trace.duration)}</span>
            </div>

            <div {...stylex.props(tracePageHeaderStyles.metadataItem)}>
              <span {...stylex.props(tracePageHeaderStyles.metadataLabel)}>{t('explore.trace-page-header.services', 'Services')}</span>
              <span {...stylex.props(tracePageHeaderStyles.metadataValue)}>{serviceCount}</span>
            </div>

            {url && url.length > 0 && (
              <div {...stylex.props(tracePageHeaderStyles.metadataItem)}>
                <span {...stylex.props(tracePageHeaderStyles.metadataLabel)}>
                  {url[0].key === 'http.route' && t('explore.trace-page-header.route', 'Route')}
                  {url[0].key === 'http.url' && t('explore.trace-page-header.url', 'URL')}
                  {url[0].key === 'http.target' && t('explore.trace-page-header.target', 'Target')}
                  {url[0].key === 'http.path' && t('explore.trace-page-header.path', 'Path')}
                </span>
                <span {...stylex.props(tracePageHeaderStyles.metadataValue)}>
                  <Tooltip
                    content={
                      <div>
                        <div>
                          <Trans
                            i18nKey="explore.trace-page-header.tooltip-url"
                            values={{
                              route: 'http.route',
                              url: 'http.url',
                              target: 'http.target',
                              path: 'http.path',
                            }}
                          >
                            {'{{route}}'} or {'{{url}}'} or {'{{target}}'} or {'{{path}}'}
                          </Trans>
                        </div>
                        <div>({url[0].value})</div>
                      </div>
                    }
                    interactive={true}
                  >
                    <span {...stylex.props(tracePageHeaderStyles.url)}>{url[0].value}</span>
                  </Tooltip>
                </span>
              </div>
            )}
          </div>

          <CollapsableSection
            label={<span {...stylex.props(tracePageHeaderStyles.overviewLabel)}>{t('explore.trace-page-header.overview', 'Overview')}</span>}
            isOpen={isOverviewOpen}
            onToggle={setIsOverviewOpen}
            {...stylex.props(tracePageHeaderStyles.overviewCollapsableSection)}
            contentClassName={mergeStylexClassName(stylex.props(tracePageHeaderStyles.overviewCollapsableSectionContent), undefined).className}
          >
            <SpanGraph
              trace={trace}
              viewRange={viewRange}
              updateNextViewRangeTime={updateNextViewRangeTime}
              updateViewRangeTime={updateViewRangeTime}
            />
          </CollapsableSection>
        </>
      )}

      {!hideHeaderDetails && (
        <div {...stylex.props(tracePageHeaderStyles.filtersContainer)}>
          <Label>{t('explore.trace-page-header.filters', 'Filters')}</Label>
          <div {...stylex.props(tracePageHeaderStyles.adhocFiltersRow)}>
            {controller && <AdHocFiltersComboboxRenderer controller={controller} />}
          </div>
          {trace && (
            <div {...stylex.props(tracePageHeaderStyles.searchAndPillsRow)}>
              <TraceFilterPills trace={trace} search={search} setSearch={setSearch} />
              <TracePageSearchBar
                trace={trace}
                search={search}
                spanFilterMatches={spanFilterMatches}
                setShowSpanFilterMatchesOnly={(showMatchesOnly: boolean) =>
                  setSearch({ ...search, matchesOnly: showMatchesOnly })
                }
                focusedSpanIndexForSearch={focusedSpanIndexForSearch}
                setFocusedSpanIndexForSearch={setFocusedSpanIndexForSearch}
                setFocusedSpanIdForSearch={setFocusedSpanIdForSearch}
                datasourceType={datasourceType}
                showSpanFilters={showSpanFilters}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
});

TracePageHeader.displayName = 'TracePageHeader';

;
