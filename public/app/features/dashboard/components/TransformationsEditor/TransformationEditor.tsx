import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { transformationEditorStyles } from './TransformationEditor.stylex';
import { createElement, useMemo } from 'react';

import {
  type DataFrame,
  type DataTransformerConfig,
  type GrafanaTheme2,
  type TransformerRegistryItem,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Icon, JSONFormatter, Drawer } from '@grafana/ui';

import { type TransformationsEditorTransformation } from './types';

interface TransformationEditorProps {
  input: DataFrame[];
  output: DataFrame[];
  debugMode?: boolean;
  index: number;
  uiConfig: TransformerRegistryItem;
  configs: TransformationsEditorTransformation[];
  onChange: (index: number, config: DataTransformerConfig) => void;
  toggleShowDebug: () => void;
}

export const TransformationEditor = ({
  input,
  output,
  debugMode,
  index,
  uiConfig,
  configs,
  onChange,
  toggleShowDebug,
}: TransformationEditorProps) => {
  const config = useMemo(() => configs[index], [configs, index]);

  const editor = useMemo(
    () =>
      createElement(uiConfig.editor, {
        options: { ...uiConfig.transformation.defaultOptions, ...config.transformation.options },
        input,
        onChange: (opts) => {
          onChange(index, {
            ...config.transformation,
            options: opts,
          });
        },
      }),
    [uiConfig.editor, uiConfig.transformation.defaultOptions, config.transformation, input, onChange, index]
  );

  return (
    <div data-testid={selectors.components.TransformTab.transformationEditor(uiConfig.name)}>
      {editor}
      {debugMode && (
        <Drawer
          title={t('dashboard.transformation-editor.title-debug-transformation', 'Debug transformation')}
          subtitle={uiConfig.name}
          onClose={toggleShowDebug}
        >
          <div
            {...stylex.props(transformationEditorStyles.debugWrapper)}
            data-testid={selectors.components.TransformTab.transformationEditorDebugger(uiConfig.name)}
          >
            <div {...stylex.props(transformationEditorStyles.debug)}>
              <div {...stylex.props(transformationEditorStyles.debugTitle)}>
                <Trans i18nKey="dashboard.transformation-editor.input-data">Input data</Trans>
              </div>
              <div {...stylex.props(transformationEditorStyles.debugJson)}>
                <JSONFormatter json={input} />
              </div>
            </div>
            <div {...stylex.props(transformationEditorStyles.debugSeparator)}>
              <Icon name="arrow-right" />
            </div>
            <div {...stylex.props(transformationEditorStyles.debug)}>
              <div {...stylex.props(transformationEditorStyles.debugTitle)}>
                <Trans i18nKey="dashboard.transformation-editor.output-data">Output data</Trans>
              </div>
              <div {...stylex.props(transformationEditorStyles.debugJson)}>{output && <JSONFormatter json={output} />}</div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

;
