import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { t, Trans } from '@grafana/i18n';
import { Drawer, Icon, JSONFormatter, Stack, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing, typography, v1 } from '@grafana/ui/stylex/tokens.stylex';

import { usePanelContext, useQueryEditorUIContext, useQueryRunnerContext } from './QueryEditorContext';
import { useTransformationDebugData } from './hooks/useTransformationDebugData';

export function TransformationDebugDisplay() {
  const { selectedTransformation, transformToggles } = useQueryEditorUIContext();
  const { data } = useQueryRunnerContext();
  const { transformations } = usePanelContext();

  const theme = useTheme2();

  const seriesData = useMemo(() => data?.series ?? [], [data?.series]);

  const { input, output } = useTransformationDebugData({
    selectedTransformation,
    transformations,
    data: seriesData,
    isActive: transformToggles.showDebug,
  });

  if (!transformToggles.showDebug || !selectedTransformation) {
    return null;
  }

  return (
    <Drawer
      title={t('query-editor-next.transformation-debug.title', 'Debug transformation')}
      subtitle={selectedTransformation.registryItem?.name}
      onClose={transformToggles.toggleDebug}
    >
      <Stack direction="row" gap={1}>
        <div {...stylex.props(styles.debug, theme.isLight ? styles.debugLight : styles.debugDark)}>
          <div {...stylex.props(styles.debugTitle)}>
            <Trans i18nKey="query-editor-next.transformation-debug.input-data">Input data</Trans>
          </div>
          <div {...stylex.props(styles.debugJson)}>
            <JSONFormatter json={input} />
          </div>
        </div>
        <div {...stylex.props(styles.debugSeparator)}>
          <Icon name="arrow-right" />
        </div>
        <div {...stylex.props(styles.debug, theme.isLight ? styles.debugLight : styles.debugDark)}>
          <div {...stylex.props(styles.debugTitle)}>
            <Trans i18nKey="query-editor-next.transformation-debug.output-data">Output data</Trans>
          </div>
          <div {...stylex.props(styles.debugJson)}>
            <JSONFormatter json={output} />
          </div>
        </div>
      </Stack>
    </Drawer>
  );
}

const styles = stylex.create({
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
  debugLight: {
    backgroundColor: v1['--gf-v1-palette-white'],
  },
  debugDark: {
    backgroundColor: v1['--gf-v1-palette-gray05'],
  },
  debugJson: {
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
});
