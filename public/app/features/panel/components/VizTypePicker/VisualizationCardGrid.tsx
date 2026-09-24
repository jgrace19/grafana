import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { visualizationCardGridStyles } from './VisualizationCardGrid.stylex';
import { Fragment, type ReactNode, useMemo } from 'react';
import { useMeasure } from 'react-use';

import {
  type GrafanaTheme2,
  type PanelData,
  type PanelPluginMeta,
  type PanelPluginVisualizationSuggestion,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { Text } from '@grafana/ui';
import { MIN_MULTI_COLUMN_SIZE } from 'app/features/panel/suggestions/constants';

import { VisualizationSuggestionCard } from './VisualizationSuggestionCard';

export interface VisualizationCardGridGroup {
  meta: PanelPluginMeta | undefined;
  items: PanelPluginVisualizationSuggestion[];
}

export interface Props {
  items?: PanelPluginVisualizationSuggestion[];
  groups?: VisualizationCardGridGroup[];
  data: PanelData;
  onItemClick: (item: PanelPluginVisualizationSuggestion, index: number) => void;
  getItemKey: (item: PanelPluginVisualizationSuggestion) => string;
  selectedKey?: string;
  minColumnWidth?: number;
  maxCardWidth?: number;
  getBadge?: (item: PanelPluginVisualizationSuggestion) => ReactNode;
}

export function VisualizationCardGrid({
  items,
  groups,
  data,
  onItemClick,
  getItemKey,
  selectedKey,
  minColumnWidth,
  maxCardWidth,
  getBadge,
}: Props) {
  const styles = (getStyles, minColumnWidth, maxCardWidth);
  const [firstCardRef, { width }] = useMeasure<HTMLDivElement>();

  const itemIndexMap = useMemo(() => {
    const map = new Map<string, number>();

    if (groups) {
      let index = 0;
      groups.forEach((group) => {
        group.items.forEach((item) => {
          map.set(getItemKey(item), index++);
        });
      });
    } else if (items) {
      items.forEach((item, idx) => {
        map.set(getItemKey(item), idx);
      });
    }

    return map;
  }, [items, groups, getItemKey]);

  const renderCard = (item: PanelPluginVisualizationSuggestion, isFirst: boolean) => {
    const itemKey = getItemKey(item);
    const itemIndex = itemIndexMap.get(itemKey) ?? -1;
    const badge = getBadge?.(item);

    return (
      <div
        key={itemKey}
        {...stylex.props(visualizationCardGridStyles.cardContainer)}
        tabIndex={0}
        role="button"
        onKeyDown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            onItemClick(item, itemIndex);
          }
        }}
        ref={isFirst ? firstCardRef : undefined}
      >
        <VisualizationSuggestionCard
          data={data}
          suggestion={item}
          width={width}
          isSelected={getItemKey(item) === selectedKey}
          onClick={() => onItemClick(item, itemIndex)}
        />
        {badge}
      </div>
    );
  };

  if (groups) {
    return (
      <div {...stylex.props(visualizationCardGridStyles.grid)}>
        {groups.map((group, groupIndex) => (
          <Fragment key={group.meta?.id || `unknown-viz-type-${groupIndex}`}>
            <div {...stylex.props(visualizationCardGridStyles.vizTypeHeader)}>
              <Text variant="body" weight="medium">
                {group.meta?.info && <img {...stylex.props(visualizationCardGridStyles.vizTypeLogo)} src={group.meta.info.logos.small} alt="" />}
                {group.meta?.name ||
                  t('panel.visualization-suggestions.unknown-viz-type', 'Unknown visualization type')}
              </Text>
            </div>
            {group.items.map((item, index) => renderCard(item, groupIndex === 0 && index === 0))}
          </Fragment>
        ))}
      </div>
    );
  }

  return <div {...stylex.props(visualizationCardGridStyles.grid)}>{items?.map((item, index) => renderCard(item, index === 0))}</div>;
}

