import * as stylex from '@stylexjs/stylex';
import { createElement, useMemo } from 'react';

import { type DataFrame, type DataTransformerConfig, type TransformerRegistryItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Icon, JSONFormatter, Drawer, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing, typography, v1 } from '@grafana/ui/stylex/tokens.stylex';

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
  const theme = useTheme2();
  const debugProps = stylex.props(
    styles.debug,
    theme.isLight ? styles.debugBackgroundLight : styles.debugBackgroundDark
  );
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
            {...stylex.props(styles.debugWrapper)}
            data-testid={selectors.components.TransformTab.transformationEditorDebugger(uiConfig.name)}
          >
            <div {...debugProps}>
              <div {...stylex.props(styles.debugTitle)}>
                <Trans i18nKey="dashboard.transformation-editor.input-data">Input data</Trans>
              </div>
              <div {...stylex.props(styles.debugJson)}>
                <JSONFormatter json={input} />
              </div>
            </div>
            <div {...stylex.props(styles.debugSeparator)}>
              <Icon name="arrow-right" />
            </div>
            <div {...debugProps}>
              <div {...stylex.props(styles.debugTitle)}>
                <Trans i18nKey="dashboard.transformation-editor.output-data">Output data</Trans>
              </div>
              <div {...stylex.props(styles.debugJson)}>{output && <JSONFormatter json={output} />}</div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

const styles = stylex.create({
  debugWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  debugSeparator: {
    width: '48px',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x0-5'],
    color: colors['--gf-colors-primary-text'],
  },
  debugTitle: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x0-25'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x0-25'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-primary'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    flexGrow: 0,
    flexShrink: 1,
  },
  debug: {
    marginTop: spacing['--gf-spacing-x1'],
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    width: '100%',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  debugBackgroundLight: {
    backgroundColor: v1['--gf-v1-palette-white'],
  },
  debugBackgroundDark: {
    backgroundColor: v1['--gf-v1-palette-gray05'],
  },
  debugJson: {
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
    padding: spacing['--gf-spacing-x0-5'],
  },
});
