
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { optionsPaneStyles } from './OptionsPane.stylex';
import { selectors } from '@grafana/e2e-selectors';
import { useSelector } from 'app/types/store';

import { OptionsPaneOptions } from './OptionsPaneOptions';
import { VisualizationButton } from './VisualizationButton';
import { VisualizationSelectPane } from './VisualizationSelectPane';
import { type OptionPaneRenderProps } from './types';
import { usePanelLatestData } from './usePanelLatestData';

export const OptionsPane = ({
  plugin,
  panel,
  onFieldConfigsChange,
  onPanelOptionsChanged,
  onPanelConfigChange,
  dashboard,
  instanceState,
}: OptionPaneRenderProps) => {
  const isVizPickerOpen = useSelector((state) => state.panelEditor.isVizPickerOpen);
  const { data } = usePanelLatestData(panel, { withTransforms: true, withFieldConfig: false }, true);

  return (
    <div {...stylex.props(optionsPaneStyles.wrapper)} data-testid={selectors.components.PanelEditor.OptionsPane.content}>
      {!isVizPickerOpen && (
        <>
          <div {...stylex.props(optionsPaneStyles.vizButtonWrapper)}>
            <VisualizationButton panel={panel} />
          </div>
          <div {...stylex.props(optionsPaneStyles.optionsWrapper)}>
            <OptionsPaneOptions
              panel={panel}
              dashboard={dashboard}
              plugin={plugin}
              instanceState={instanceState}
              data={data}
              onFieldConfigsChange={onFieldConfigsChange}
              onPanelOptionsChanged={onPanelOptionsChanged}
              onPanelConfigChange={onPanelConfigChange}
            />
          </div>
        </>
      )}
      {isVizPickerOpen && <VisualizationSelectPane panel={panel} data={data} />}
    </div>
  );
};

;
