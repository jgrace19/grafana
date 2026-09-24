import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';
import * as React from 'react';

import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { FilterInput, RadioButtonGroup, ScrollContainer } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { isPanelModelLibraryPanel } from '../../../library-panels/guard';

import { OptionsPaneCategory } from './OptionsPaneCategory';
import { type OptionsPaneCategoryDescriptor } from './OptionsPaneCategoryDescriptor';
import { getFieldOverrideCategories } from './getFieldOverrideElements';
import { getLibraryPanelOptionsCategory } from './getLibraryPanelOptions';
import { getPanelFrameCategory } from './getPanelFrameOptions';
import { getVisualizationOptions } from './getVisualizationOptions';
import { OptionSearchEngine } from './state/OptionSearchEngine';
import { getRecentOptions } from './state/getRecentOptions';
import { type OptionPaneRenderProps } from './types';
import './OptionsPaneOptions.global.css';

export const OptionsPaneOptions = (props: OptionPaneRenderProps) => {
  const { plugin, panel } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [listMode, setListMode] = useState(OptionFilter.All);
  const [panelFrameOptions, vizOptions, libraryPanelOptions] = useMemo(
    () => [getPanelFrameCategory(props), getVisualizationOptions(props), getLibraryPanelOptionsCategory(props)],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panel.configRev, props.data, props.instanceState, searchQuery]
  );

  const justOverrides = useMemo(
    () =>
      getFieldOverrideCategories(
        props.panel.fieldConfig,
        props.plugin.fieldConfigRegistry,
        props.data?.series ?? [],
        searchQuery,
        props.onFieldConfigsChange
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panel.configRev, props.data, props.instanceState, searchQuery]
  );

  const mainBoxElements: React.ReactNode[] = [];
  const isSearching = searchQuery.length > 0;
  const optionRadioFilters = useMemo(getOptionRadioFilters, []);

  const allOptions = isPanelModelLibraryPanel(panel)
    ? [libraryPanelOptions, panelFrameOptions, ...vizOptions]
    : [panelFrameOptions, ...vizOptions];

  if (isSearching) {
    mainBoxElements.push(renderSearchHits(allOptions, justOverrides, searchQuery));
  } else {
    switch (listMode) {
      case OptionFilter.All:
        if (isPanelModelLibraryPanel(panel)) {
          // Library Panel options first
          mainBoxElements.push(libraryPanelOptions.renderElement());
        }
        // Panel frame options second
        mainBoxElements.push(panelFrameOptions.renderElement());

        // Then add all panel and field defaults
        for (const item of vizOptions) {
          mainBoxElements.push(item.renderElement());
        }

        for (const item of justOverrides) {
          mainBoxElements.push(item.renderElement());
        }
        break;
      case OptionFilter.Overrides:
        for (const override of justOverrides) {
          mainBoxElements.push(override.renderElement());
        }
        break;
      case OptionFilter.Recent:
        mainBoxElements.push(
          <OptionsPaneCategory
            id="Recent options"
            title={t('dashboard.options-pane-options.Recent options-title-recent-options', 'Recent options')}
            key="Recent options"
            forceOpen={true}
          >
            {getRecentOptions(allOptions).map((item) => item.renderElement())}
          </OptionsPaneCategory>
        );
        break;
    }
  }

  // only show radio buttons if we are searching or if the plugin has field config
  const showSearchRadioButtons = !isSearching && !plugin.fieldConfigRegistry.isEmpty();

  return (
    <div {...mergeStylexProps(stylex.props(styles.wrapper), { className: 'gf-options-pane-options' })}>
      <div {...stylex.props(styles.formBox)}>
        <div {...stylex.props(styles.formRow)}>
          <FilterInput
            width={0}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('dashboard.options-pane-options.placeholder-search-options', 'Search options')}
          />
        </div>
        {showSearchRadioButtons && (
          <div {...stylex.props(styles.formRow)}>
            <RadioButtonGroup options={optionRadioFilters} value={listMode} fullWidth onChange={setListMode} />
          </div>
        )}
      </div>
      <ScrollContainer>
        <div {...stylex.props(styles.mainBox)}>{mainBoxElements}</div>
      </ScrollContainer>
    </div>
  );
};

function getOptionRadioFilters(): Array<SelectableValue<OptionFilter>> {
  return [
    { label: OptionFilter.All, value: OptionFilter.All },
    { label: OptionFilter.Overrides, value: OptionFilter.Overrides },
  ];
}

export enum OptionFilter {
  All = 'All',
  Overrides = 'Overrides',
  Recent = 'Recent',
}

export function renderSearchHits(
  allOptions: OptionsPaneCategoryDescriptor[],
  overrides: OptionsPaneCategoryDescriptor[],
  searchQuery: string
) {
  const engine = new OptionSearchEngine(allOptions, overrides);
  const { optionHits, totalCount, overrideHits } = engine.search(searchQuery);

  return (
    <div key="search results">
      <OptionsPaneCategory
        id="Found options"
        title={t('dashboard.options-pane-options.title-matched', 'Matched {{count}}/{{totalCount}} options', {
          count: optionHits.length,
          totalCount,
        })}
        key="Normal options"
        forceOpen={true}
      >
        {optionHits.map((hit) => hit.renderElement(searchQuery))}
      </OptionsPaneCategory>
      {overrideHits.map((override) => override.renderElement(searchQuery))}
    </div>
  );
}

const styles = stylex.create({
  // .search-fragment-highlight lives in OptionsPaneOptions.global.css (react-highlight-words renders it)
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formRow: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
  formBox: {
    padding: spacing['--gf-spacing-x1'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderTopLeftRadius: `calc(${shape['--gf-shape-radius-default']} * 1.5)`,
    borderBottomStyle: 'none',
  },
  mainBox: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderTopStyle: 'none',
    flexGrow: 1,
  },
});
