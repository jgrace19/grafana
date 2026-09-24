import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { vizTypePickerStyles } from './VizTypePicker.stylex';
import { useMemo } from 'react';

import { Trans } from '@grafana/i18n';
import { useListedPanelPluginMetas } from '@grafana/runtime/internal';
import { EmptySearchResult } from '@grafana/ui';

import { filterPluginList } from '../../state/util';

import { VizTypePickerPlugin } from './VizTypePickerPlugin';
import { type VizTypeChangeDetails } from './types';

export interface Props {
  pluginId: string;
  searchQuery: string;
  onChange: (options: VizTypeChangeDetails) => void;
  trackSearch?: (q: string, count: number) => void;
}

export function VizTypePicker({ pluginId, searchQuery, onChange, trackSearch }: Props) {
  const { value: pluginsList = [] } = useListedPanelPluginMetas();

  const filteredPluginTypes = useMemo(() => {
    const result = filterPluginList(pluginsList, searchQuery, pluginId);
    if (trackSearch) {
      trackSearch(searchQuery, result.length);
    }
    return result;
  }, [pluginsList, searchQuery, pluginId, trackSearch]);

  if (filteredPluginTypes.length === 0) {
    return (
      <EmptySearchResult>
        <Trans i18nKey="panel.viz-type-picker.could-anything-matching-query">
          Could not find anything matching your query
        </Trans>
      </EmptySearchResult>
    );
  }

  return (
    <div {...stylex.props(vizTypePickerStyles.grid)}>
      {filteredPluginTypes.map((plugin, idx) => (
        <VizTypePickerPlugin
          disabled={false}
          key={plugin.id}
          isCurrent={plugin.id === pluginId}
          plugin={plugin}
          onSelect={(withModKey) =>
            onChange({
              pluginId: plugin.id,
              withModKey,
            })
          }
        />
      ))}
    </div>
  );
}

