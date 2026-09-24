import * as stylex from '@stylexjs/stylex';
import { debounce } from 'lodash';
import { useCallback, useId, useMemo, useState } from 'react';
import { useMedia, useSessionStorage } from 'react-use';

import { type PanelData } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { type VizPanel } from '@grafana/scenes';
import { Button, Field, FilterInput, ScrollContainer, Stack, Tab, TabContent, TabsBar, useTheme2 } from '@grafana/ui';
import { colors, shadows, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { LS_VISUALIZATION_SELECT_TAB_KEY } from 'app/core/constants';
import { VisualizationSelectPaneTab } from 'app/features/dashboard/components/PanelEditor/types';
import { VisualizationSuggestions } from 'app/features/panel/components/VizTypePicker/VisualizationSuggestions';
import { VizTypePicker } from 'app/features/panel/components/VizTypePicker/VizTypePicker';
import { type VizTypeChangeDetails } from 'app/features/panel/components/VizTypePicker/types';

import { PanelModelCompatibilityWrapper } from '../utils/PanelModelCompatibilityWrapper';

import { INTERACTION_EVENT_NAME, INTERACTION_ITEM } from './interaction';

export interface Props {
  data?: PanelData;
  showBackButton?: boolean;
  panel: VizPanel;
  onChange: (options: VizTypeChangeDetails, panel?: VizPanel) => void;
  onClose: () => void;
  isNewPanel?: boolean;
  hasPickedViz?: boolean;
}

const getTabs = (): Array<{ label: string; value: VisualizationSelectPaneTab }> => {
  const suggestionsTab = {
    label: t('dashboard-scene.panel-viz-type-picker.radio-options.label.suggestions', 'Suggestions'),
    value: VisualizationSelectPaneTab.Suggestions,
  };
  const allVisualizationsTab = {
    label: t('dashboard-scene.panel-viz-type-picker.radio-options.label.all-visualizations', 'All visualizations'),
    value: VisualizationSelectPaneTab.Visualizations,
  };
  return config.featureToggles.newVizSuggestions
    ? [suggestionsTab, allVisualizationsTab]
    : [allVisualizationsTab, suggestionsTab];
};

export function PanelVizTypePicker({
  panel,
  data,
  onChange,
  onClose,
  showBackButton,
  isNewPanel,
  hasPickedViz,
}: Props) {
  const theme = useTheme2();
  const panelModel = useMemo(() => new PanelModelCompatibilityWrapper(panel), [panel]);
  const filterId = useId();

  const isMobile = useMedia(`(max-width: ${theme.breakpoints.values.sm}px)`);

  /** SEARCH */
  const [searchQuery, setSearchQuery] = useState('');
  const trackSearch = useMemo(
    () =>
      debounce((q, count) => {
        if (q) {
          reportInteraction(INTERACTION_EVENT_NAME, {
            item: INTERACTION_ITEM.SEARCH,
            query: q,
            result_count: count,
            creator_team: 'grafana_plugins_catalog',
            schema_version: '1.0.0',
          });
        }
      }, 300),
    []
  );

  /** TABS */
  const tabs = useMemo(getTabs, []);
  const defaultTab = tabs[0].value;
  const [storedListMode, setStoredListMode] = useSessionStorage(LS_VISUALIZATION_SELECT_TAB_KEY, defaultTab);

  const shouldDefaultToSuggestions =
    (isNewPanel && !hasPickedViz && config.featureToggles.newVizSuggestions) ||
    storedListMode === VisualizationSelectPaneTab.Suggestions;
  const initialTab = shouldDefaultToSuggestions ? VisualizationSelectPaneTab.Suggestions : storedListMode;
  const [listMode, setListMode] = useState(initialTab);

  const handleListModeChange = useCallback(
    (value: VisualizationSelectPaneTab) => {
      reportInteraction(INTERACTION_EVENT_NAME, {
        item: INTERACTION_ITEM.CHANGE_TAB,
        tab: VisualizationSelectPaneTab[value],
        creator_team: 'grafana_plugins_catalog',
        schema_version: '1.0.0',
      });
      setListMode(value);
      setStoredListMode(value);
    },
    [setListMode, setStoredListMode]
  );

  const handleBackButtonClick = useCallback(() => {
    reportInteraction(INTERACTION_EVENT_NAME, {
      item: INTERACTION_ITEM.BACK_BUTTON,
      tab: VisualizationSelectPaneTab[listMode],
      creator_team: 'grafana_plugins_catalog',
      schema_version: '1.0.0',
    });
    onClose();
  }, [listMode, onClose]);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <TabsBar className={stylex.props(styles.tabs).className} hideBorder={true}>
        {tabs.map((tab) => (
          <Tab
            className={stylex.props(styles.tab).className}
            key={tab.value}
            label={tab.label}
            active={listMode === tab.value}
            onChangeTab={() => handleListModeChange(tab.value)}
            data-testid={selectors.components.Tab.title(VisualizationSelectPaneTab[tab.value])}
          />
        ))}
      </TabsBar>
      <div {...stylex.props(styles.stickySearchWrapper)}>
        <Field
          className={stylex.props(styles.searchField).className}
          noMargin
          htmlFor={filterId}
          aria-label={t('dashboard-scene.panel-viz-type-picker.placeholder-search-for', 'Search for...')}
        >
          <Stack direction="row" gap={1}>
            {showBackButton && (
              <Button
                aria-label={t('dashboard-scene.panel-viz-type-picker.title-close', 'Close')}
                fill="text"
                variant="secondary"
                icon="arrow-left"
                className={stylex.props(styles.backButton).className}
                data-testid={selectors.components.PanelEditor.toggleVizPicker}
                onClick={handleBackButtonClick}
              >
                <Trans i18nKey="dashboard-scene.panel-viz-type-picker.button.close">Back</Trans>
              </Button>
            )}
            <FilterInput
              id={filterId}
              autoFocus={!isMobile}
              className={stylex.props(styles.filter).className}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('dashboard-scene.panel-viz-type-picker.placeholder-search-for', 'Search for...')}
            />
          </Stack>
        </Field>
      </div>
      <ScrollContainer>
        <TabContent className={stylex.props(styles.tabContent).className}>
          <Stack gap={1} direction="column">
            {listMode === VisualizationSelectPaneTab.Suggestions && (
              <VisualizationSuggestions
                onChange={onChange}
                panel={panelModel}
                data={data}
                searchQuery={searchQuery}
                isNewPanel={isNewPanel}
              />
            )}
            {listMode === VisualizationSelectPaneTab.Visualizations && (
              <VizTypePicker
                pluginId={panel.state.pluginId}
                searchQuery={searchQuery}
                trackSearch={trackSearch}
                onChange={onChange}
              />
            )}
          </Stack>
        </TabContent>
      </ScrollContainer>
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
  },
  searchField: {
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: spacing['--gf-spacing-x1-5'],
    marginBottom: spacing['--gf-spacing-x0'],
    marginLeft: spacing['--gf-spacing-x0'],
    width: '100%',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  stickySearchWrapper: {
    boxShadow: shadows['--gf-shadows-z1'],
    zIndex: 1,
  },
  tabs: {
    width: '100%',
  },
  tab: {
    flexGrow: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  tabContent: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
  },
  backButton: {
    marginLeft: spacing['--gf-spacing-x1'], // shift button to the right
  },
  filter: {
    minHeight: spacing['--gf-spacing-x4'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x1'],
  },
});
