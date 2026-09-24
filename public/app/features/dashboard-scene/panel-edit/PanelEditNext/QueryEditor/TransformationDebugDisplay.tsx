import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { transformationDebugDisplayStyles } from './TransformationDebugDisplay.stylex';
import { useMemo } from 'react';

import { t, Trans } from '@grafana/i18n';
import {Drawer, Icon, JSONFormatter, Stack} from '@grafana/ui';

import { usePanelContext, useQueryEditorUIContext, useQueryRunnerContext } from './QueryEditorContext';
import { useTransformationDebugData } from './hooks/useTransformationDebugData';

export function TransformationDebugDisplay() {
  const { selectedTransformation, transformToggles } = useQueryEditorUIContext();
  const { data } = useQueryRunnerContext();
  const { transformations } = usePanelContext();


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
        <div {...stylex.props(transformationDebugDisplayStyles.debug)}>
          <div {...stylex.props(transformationDebugDisplayStyles.debugTitle)}>
            <Trans i18nKey="query-editor-next.transformation-debug.input-data">Input data</Trans>
          </div>
          <div {...stylex.props(transformationDebugDisplayStyles.debugJson)}>
            <JSONFormatter json={input} />
          </div>
        </div>
        <div {...stylex.props(transformationDebugDisplayStyles.debugSeparator)}>
          <Icon name="arrow-right" />
        </div>
        <div {...stylex.props(transformationDebugDisplayStyles.debug)}>
          <div {...stylex.props(transformationDebugDisplayStyles.debugTitle)}>
            <Trans i18nKey="query-editor-next.transformation-debug.output-data">Output data</Trans>
          </div>
          <div {...stylex.props(transformationDebugDisplayStyles.debugJson)}>
            <JSONFormatter json={output} />
          </div>
        </div>
      </Stack>
    </Drawer>
  );
}


