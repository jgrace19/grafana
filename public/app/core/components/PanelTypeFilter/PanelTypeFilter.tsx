import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelTypeFilterStyles } from './PanelTypeFilter.stylex';
import { useCallback, useMemo, useState, type JSX } from 'react';

import { Trans, t } from '@grafana/i18n';
import { useListedPanelPluginMetas } from '@grafana/runtime/internal';
import { Icon, Button, MultiSelect } from '@grafana/ui';

export interface Props {
  onChange: (plugins: PanelPluginMeta[]) => void;
  maxMenuHeight?: number;
}

export const PanelTypeFilter = ({ onChange: propsOnChange, maxMenuHeight }: Props): JSX.Element => {
  const { value: plugins = [] } = useListedPanelPluginMetas();
  const options = useMemo(
    () =>
      plugins
        .map((p) => ({ label: p.name, imgUrl: p.info.logos.small, value: p }))
        .sort((a, b) => a.label?.localeCompare(b.label)),
    [plugins]
  );
  const [value, setValue] = useState<Array<SelectableValue<PanelPluginMeta>>>([]);
  const onChange = useCallback(
    (plugins: Array<SelectableValue<PanelPluginMeta>>) => {
      const changedPlugins = plugins.filter((p) => p.value).map((p) => p.value!);
      propsOnChange(changedPlugins);
      setValue(plugins);
    },
    [propsOnChange]
  );

  const selectOptions = {
    defaultOptions: true,
    getOptionLabel: (i: SelectableValue<PanelPluginMeta>) => i.label,
    getOptionValue: (i: SelectableValue<PanelPluginMeta>) => i.value,
    noOptionsMessage: t('panel-type-filter.select-no-options', 'No panel types found'),
    placeholder: t('panel-type-filter.select-placeholder', 'Filter by type'),
    maxMenuHeight,
    options,
    value,
    onChange,
  };

  return (
    <div {...stylex.props(panelTypeFilterStyles.container)}>
      {value.length > 0 && (
        <Button size="xs" icon="trash-alt" fill="text" {...stylex.props(panelTypeFilterStyles.clear)} onClick={() => onChange([])}>
          <Trans i18nKey="panel-type-filter.clear-button">Clear types</Trans>
        </Button>
      )}
      <MultiSelect<PanelPluginMeta>
        {...selectOptions}
        prefix={<Icon name="filter" />}
        aria-label={t('panel-type-filter.select-aria-label', 'Panel type filter')}
      />
    </div>
  );
};

