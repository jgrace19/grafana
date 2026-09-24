import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { visualizationSelectPaneStyles } from './VisualizationSelectPane.stylex';
import { useCallback, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, Field, FilterInput, RadioButtonGroup, ScrollContainer, useStyles2 } from '@grafana/ui';
import { LS_VISUALIZATION_SELECT_TAB_KEY } from 'app/core/constants';
import { PanelLibraryOptionsGroup } from 'app/features/library-panels/components/PanelLibraryOptionsGroup/PanelLibraryOptionsGroup';
import { VisualizationSuggestions } from 'app/features/panel/components/VizTypePicker/VisualizationSuggestions';
import { type VizTypeChangeDetails } from 'app/features/panel/components/VizTypePicker/types';
import { useDispatch, useSelector } from 'app/types/store';

import { VizTypePicker } from '../../../panel/components/VizTypePicker/VizTypePicker';
import { changePanelPlugin } from '../../../panel/state/actions';
import { type PanelModel } from '../../state/PanelModel';
import { getPanelPluginWithFallback } from '../../state/selectors';

import { toggleVizPicker } from './state/reducers';
import { VisualizationSelectPaneTab } from './types';

interface Props {
  panel: PanelModel;
  data?: PanelData;
}

export const VisualizationSelectPane = ({ panel, data }: Props) => {
  const plugin = useSelector(getPanelPluginWithFallback(panel.type));
  const [searchQuery, setSearchQuery] = useState('');

  const tabKey = LS_VISUALIZATION_SELECT_TAB_KEY;
  const defaultTab = VisualizationSelectPaneTab.Visualizations;

  const [listMode, setListMode] = useLocalStorage(tabKey, defaultTab);

  const dispatch = useDispatch();
  const searchRef = useRef<HTMLInputElement | null>(null);

  const onVizChange = useCallback(
    (pluginChange: VizTypeChangeDetails) => {
      dispatch(changePanelPlugin({ panel: panel, ...pluginChange }));

      // close viz picker unless a mod key is pressed while clicking
      if (!pluginChange.withModKey) {
        dispatch(toggleVizPicker(false));
      }
    },
    [dispatch, panel]
  );

  const onCloseVizPicker = () => {
    dispatch(toggleVizPicker(false));
  };

  if (!plugin) {
    return null;
  }

  const radioOptions: Array<SelectableValue<VisualizationSelectPaneTab>> = [
    {
      label: t('dashboard.visualization-select-pane.radio-options.label.visualizations', 'Visualizations'),
      value: VisualizationSelectPaneTab.Visualizations,
    },
    {
      label: t('dashboard.visualization-select-pane.radio-options.label.suggestions', 'Suggestions'),
      value: VisualizationSelectPaneTab.Suggestions,
    },
    {
      label: t('dashboard.visualization-select-pane.radio-options.label.library-panels', 'Library panels'),
      value: VisualizationSelectPaneTab.LibraryPanels,
      description: t(
        'dashboard.visualization-select-pane.radio-options.description.reusable-panels-share-between-multiple-dashboards',
        'Reusable panels you can share between multiple dashboards.'
      ),
    },
  ];

  return (
    <div {...stylex.props(visualizationSelectPaneStyles.openWrapper)}>
      <div {...stylex.props(visualizationSelectPaneStyles.formBox)}>
        <div {...stylex.props(visualizationSelectPaneStyles.searchRow)}>
          <FilterInput
            value={searchQuery}
            onChange={setSearchQuery}
            ref={searchRef}
            autoFocus={true}
            placeholder={t('dashboard.visualization-select-pane.placeholder-search-for', 'Search for...')}
          />
          <Button
            aria-label={t('dashboard.visualization-select-pane.title-close', 'Close')}
            variant="secondary"
            icon="angle-up"
            {...stylex.props(visualizationSelectPaneStyles.closeButton)}
            data-testid={selectors.components.PanelEditor.toggleVizPicker}
            onClick={onCloseVizPicker}
          />
        </div>
        <Field {...stylex.props(visualizationSelectPaneStyles.customFieldMargin)}>
          <RadioButtonGroup options={radioOptions} value={listMode} onChange={setListMode} fullWidth />
        </Field>
      </div>
      <div {...stylex.props(visualizationSelectPaneStyles.scrollWrapper)}>
        <ScrollContainer>
          <div {...stylex.props(visualizationSelectPaneStyles.scrollContent)}>
            {listMode === VisualizationSelectPaneTab.Visualizations && (
              <VizTypePicker pluginId={plugin.meta.id} onChange={onVizChange} searchQuery={searchQuery} />
            )}
            {listMode === VisualizationSelectPaneTab.Suggestions && (
              <VisualizationSuggestions onChange={onVizChange} panel={panel} data={data} />
            )}
            {listMode === VisualizationSelectPaneTab.LibraryPanels && (
              <PanelLibraryOptionsGroup searchQuery={searchQuery} panel={panel} key="Panel Library" />
            )}
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
};

VisualizationSelectPane.displayName = 'VisualizationSelectPane';

;
