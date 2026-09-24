import * as stylex from '@stylexjs/stylex';
import { useCallback, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { type PanelData, type SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, Field, FilterInput, RadioButtonGroup, ScrollContainer } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
import './VisualizationSelectPane.css';

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
    <div {...stylex.props(styles.openWrapper)}>
      <div {...stylex.props(styles.formBox)}>
        <div {...stylex.props(styles.searchRow)}>
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
            className={stylex.props(styles.closeButton).className}
            data-testid={selectors.components.PanelEditor.toggleVizPicker}
            onClick={onCloseVizPicker}
          />
        </div>
        <Field className="gf-visualization-select-pane-field">
          <RadioButtonGroup options={radioOptions} value={listMode} onChange={setListMode} fullWidth />
        </Field>
      </div>
      <div {...stylex.props(styles.scrollWrapper)}>
        <ScrollContainer>
          <div {...stylex.props(styles.scrollContent)}>
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

const styles = stylex.create({
  scrollWrapper: {
    flexGrow: 1,
    minHeight: 0,
  },
  scrollContent: {
    padding: spacing['--gf-spacing-x1'],
  },
  openWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
    height: '100%',
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
  },
  searchRow: {
    display: 'flex',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  closeButton: {
    marginLeft: spacing['--gf-spacing-x1'],
  },
  formBox: {
    padding: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
  },
});
