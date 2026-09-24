import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { t, Trans } from '@grafana/i18n';
import { Button, Icon, Stack, useTheme2 } from '@grafana/ui';
import { durations, easings, motion, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getQueryEditorColors, TIME_OPTION_PLACEHOLDER } from '../../constants';
import { trackQueryOptionsToggle } from '../../tracking';
import { useDatasourceContext, useQueryEditorUIContext, useQueryRunnerContext } from '../QueryEditorContext';
import { QueryOptionField } from '../types';

import './QueryEditorFooter.css';

interface FooterLabelValue {
  id: QueryOptionField;
  label: string;
  value: string;
  isActive?: boolean;
}

export function QueryEditorFooter() {
  const themeColors = getQueryEditorColors(useTheme2());

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
    <div {...stylex.props(styles.container, styles.background(themeColors.footerBackground))}>
      <div {...stylex.props(styles.queryOptionsWrapper)}>
        <Button
          fill="text"
          size="sm"
          onClick={(e) => handleItemClick(e)}
          aria-label={t('query-editor-next.footer.query-options', 'Query Options')}
        >
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Trans i18nKey="query-editor-next.footer.query-options">Query Options</Trans>
            <Icon name="angle-down" xstyle={[styles.chevron, isQueryOptionsOpen && styles.chevronOpen]} />
          </Stack>
        </Button>
      </div>

      <ul {...stylex.props(styles.itemsList)}>
        {items.map((item) => (
          <li key={item.id}>
            <Button
              fill="text"
              size="sm"
              className="gf-query-editor-footer-item"
              onClick={(e) => handleItemClick(e, item.id)}
              aria-label={t('query-editor-next.footer.edit-option', 'Edit {{label}}', { label: item.label })}
            >
              {item.isActive && <span {...stylex.props(styles.activeIndicator)} />}
              <span {...stylex.props(styles.label)}>{item.label}</span>
              <span {...stylex.props(styles.value, item.isActive && styles.valueActive)}>{item.value}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = stylex.create({
  container: {
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    zIndex: zIndex.navbarFixed,
    // FOOTER_HEIGHT in ../../constants.ts
    height: 32,
    overflow: 'hidden',
  },
  background: (backgroundColor: string) => ({ backgroundColor }),
  itemsList: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    listStyle: 'none',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  label: {
    color: colors['--gf-colors-text-primary'],
  },
  value: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
  valueActive: {
    color: colors['--gf-colors-success-text'],
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: shape['--gf-shape-radius-circle'],
    backgroundColor: colors['--gf-colors-success-text'],
    flexShrink: 0,
  },
  chevron: {
    transitionProperty: { default: null, [motion.noPreference]: 'transform' },
    transitionDuration: { default: null, [motion.noPreference]: durations.shorter },
    transitionTimingFunction: { default: null, [motion.noPreference]: easings.easeInOut },
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  queryOptionsWrapper: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
});
