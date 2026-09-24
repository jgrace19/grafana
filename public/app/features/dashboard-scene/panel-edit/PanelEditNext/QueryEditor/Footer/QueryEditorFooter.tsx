import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryEditorFooterStyles } from './QueryEditorFooter.stylex';
import { useMemo } from 'react';

import { t, Trans } from '@grafana/i18n';
import { Button, Icon, Stack } from '@grafana/ui';

import { FOOTER_HEIGHT, getQueryEditorColors, TIME_OPTION_PLACEHOLDER } from '../../constants';
import { trackQueryOptionsToggle } from '../../tracking';
import { useDatasourceContext, useQueryEditorUIContext, useQueryRunnerContext } from '../QueryEditorContext';
import { QueryOptionField } from '../types';

interface FooterLabelValue {
  id: QueryOptionField;
  label: string;
  value: string;
  isActive?: boolean;
}

export function QueryEditorFooter() {

  const { queryOptions } = useQueryEditorUIContext();
  const { options, openSidebar, closeSidebar, isQueryOptionsOpen } = queryOptions;
  const { data } = useQueryRunnerContext();
  const { datasource } = useDatasourceContext();

  // Compute footer items from actual query options
  // Items with isActive=true have non-default (user-set) values and are highlighted
  const items: FooterLabelValue[] = useMemo(() => {
    const realMaxDataPoints = data?.request?.maxDataPoints;
    const realInterval = data?.request?.interval;
    const minIntervalOnDs = datasource?.interval ?? t('query-editor-next.footer.placeholder.no-limit', 'No limit');

    return [
      {
        id: QueryOptionField.maxDataPoints,
        label: t('query-editor-next.footer.label.max-data-points', 'Max data points'),
        value: options.maxDataPoints != null ? String(options.maxDataPoints) : String(realMaxDataPoints ?? '-'),
        isActive: options.maxDataPoints != null,
      },
      {
        id: QueryOptionField.minInterval,
        label: t('query-editor-next.footer.label.min-interval', 'Min interval'),
        value: options.minInterval ?? minIntervalOnDs,
        isActive: options.minInterval != null,
      },
      {
        id: QueryOptionField.interval,
        label: t('query-editor-next.footer.label.interval', 'Interval'),
        value: realInterval ?? '-',
        isActive: false, // Interval is always computed, never user-set
      },
      {
        id: QueryOptionField.relativeTime,
        label: t('query-editor-next.footer.label.relative-time', 'Relative time'),
        value: options.timeRange?.from ?? TIME_OPTION_PLACEHOLDER,
        isActive: options.timeRange?.from != null,
      },
      {
        id: QueryOptionField.timeShift,
        label: t('query-editor-next.footer.label.time-shift', 'Time shift'),
        value: options.timeRange?.shift ?? TIME_OPTION_PLACEHOLDER,
        isActive: options.timeRange?.shift != null,
      },
    ];
  }, [options, data, datasource]);

  const handleItemClick = (event: React.MouseEvent, fieldId?: QueryOptionField) => {
    // Stop propagation to prevent ClickOutsideWrapper from immediately closing
    event.stopPropagation();

    // Don't focus interval since it's read-only
    if (fieldId && fieldId !== QueryOptionField.interval) {
      trackQueryOptionsToggle(true);
      openSidebar(fieldId);
    } else if (!isQueryOptionsOpen) {
      trackQueryOptionsToggle(true);
      openSidebar();
    } else {
      trackQueryOptionsToggle(false);
      closeSidebar();
    }
  };

  return (
    <div {...stylex.props(queryEditorFooterStyles.container)}>
      <div {...stylex.props(queryEditorFooterStyles.queryOptionsWrapper)}>
        <Button
          fill="text"
          size="sm"
          onClick={(e) => handleItemClick(e)}
          aria-label={t('query-editor-next.footer.query-options', 'Query Options')}
        >
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Trans i18nKey="query-editor-next.footer.query-options">Query Options</Trans>
            <Icon
              name="angle-down"
              {...stylex.props(
                queryEditorFooterStyles.chevron,
                isQueryOptionsOpen && queryEditorFooterStyles.chevronOpen
              )}
            />
          </Stack>
        </Button>
      </div>

      <ul {...stylex.props(queryEditorFooterStyles.itemsList)}>
        {items.map((item) => (
          <li key={item.id}>
            <Button
              fill="text"
              size="sm"
              {...stylex.props(queryEditorFooterStyles.itemButton)}
              onClick={(e) => handleItemClick(e, item.id)}
              aria-label={t('query-editor-next.footer.edit-option', 'Edit {{label}}', { label: item.label })}
            >
              {item.isActive && <span {...stylex.props(queryEditorFooterStyles.activeIndicator)} />}
              <span {...stylex.props(queryEditorFooterStyles.label)}>{item.label}</span>
              <span
                {...stylex.props(
                  queryEditorFooterStyles.value,
                  item.isActive && queryEditorFooterStyles.valueActive
                )}
              >
                {item.value}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

