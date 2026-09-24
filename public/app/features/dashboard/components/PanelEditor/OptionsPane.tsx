import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
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
    <div {...stylex.props(styles.wrapper)} data-testid={selectors.components.PanelEditor.OptionsPane.content}>
      {!isVizPickerOpen && (
        <>
          <div {...stylex.props(styles.vizButtonWrapper)}>
            <VisualizationButton panel={panel} />
          </div>
          <div {...stylex.props(styles.optionsWrapper)}>
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

const styles = stylex.create({
  wrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    padding: 0,
  },
  optionsWrapper: {
    flexGrow: 1,
    minHeight: 0,
  },
  vizButtonWrapper: {
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: 0,
  },
});
