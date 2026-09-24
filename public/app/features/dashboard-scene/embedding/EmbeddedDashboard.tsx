import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { urlUtil } from '@grafana/data';
import { t } from '@grafana/i18n';
import { type EmbeddedDashboardProps } from '@grafana/runtime';
import { SceneObjectStateChangedEvent, sceneUtils } from '@grafana/scenes';
import { Spinner, Alert } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { getMessageFromError } from 'app/core/utils/errors';
import { DashboardRoutes } from 'app/types/dashboard';

import { getDashboardScenePageStateManager } from '../pages/DashboardScenePageStateManager';
import { type DashboardScene } from '../scene/DashboardScene';

export function EmbeddedDashboard(props: EmbeddedDashboardProps) {
  const stateManager = getDashboardScenePageStateManager();
  const { dashboard, loadError } = stateManager.useState();

  useEffect(() => {
    stateManager.loadDashboard({ uid: props.uid!, route: DashboardRoutes.Embedded });
    return () => {
      stateManager.clearState();
    };
  }, [stateManager, props.uid]);

  if (loadError) {
    return (
      <Alert severity="error" title={t('dashboard.errors.failed-to-load', 'Failed to load dashboard')}>
        {getMessageFromError(loadError)}
      </Alert>
    );
  }

  if (!dashboard) {
    return <Spinner />;
  }

  return <EmbeddedDashboardRenderer model={dashboard} {...props} />;
}

interface RendererProps extends EmbeddedDashboardProps {
  model: DashboardScene;
}

function EmbeddedDashboardRenderer({ model, initialState, onStateChange }: RendererProps) {
  const [isActive, setIsActive] = useState(false);
  const { controls, body } = model.useState();

  useEffect(() => {
    setIsActive(true);

    if (initialState) {
      const searchParms = new URLSearchParams(initialState);
      sceneUtils.syncStateFromSearchParams(model, searchParms);
    }

    return model.activate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useSubscribeToEmbeddedUrlState(onStateChange, model);

  if (!isActive) {
    return null;
  }

  return (
    <div {...stylex.props(styles.canvas, controls && styles.canvasWithControls)}>
      {controls && (
        <div {...stylex.props(styles.controlsWrapper)}>
          <controls.Component model={controls} />
        </div>
      )}
      <div {...stylex.props(styles.body)}>
        <body.Component model={body} />
      </div>
    </div>
  );
}

function useSubscribeToEmbeddedUrlState(onStateChange: ((state: string) => void) | undefined, model: DashboardScene) {
  useEffect(() => {
    if (!onStateChange) {
      return;
    }

    let lastState = '';
    const sub = model.subscribeToEvent(SceneObjectStateChangedEvent, (evt) => {
      if (evt.payload.changedObject.urlSync) {
        const state = sceneUtils.getUrlState(model);
        const stateAsString = urlUtil.renderUrl('', state);

        if (lastState !== stateAsString) {
          lastState = stateAsString;
          onStateChange(stateAsString);
        }
      }
    });

    return () => sub.unsubscribe();
  }, [model, onStateChange]);
}

const styles = stylex.create({
  canvas: {
    display: 'grid',
    gridTemplateAreas: '"panels"',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    flexBasis: '100%',
    flexGrow: 1,
  },
  canvasWithControls: {
    gridTemplateAreas: '"controls" "panels"',
    gridTemplateRows: 'auto 1fr',
  },
  body: {
    flexGrow: 1,
    display: 'flex',
    gap: '8px',
    gridColumnEnd: 'panels',
    gridColumnStart: 'panels',
    gridRowEnd: 'panels',
    gridRowStart: 'panels',
    marginBottom: spacing['--gf-spacing-x2'],
  },
  controlsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    gridColumnEnd: 'controls',
    gridColumnStart: 'controls',
    gridRowEnd: 'controls',
    gridRowStart: 'controls',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
});
