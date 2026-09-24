import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { embeddedDashboardStyles } from './EmbeddedDashboard.stylex';
import { useEffect, useState } from 'react';

import { t } from '@grafana/i18n';
import { type EmbeddedDashboardProps } from '@grafana/runtime';
import { SceneObjectStateChangedEvent, sceneUtils } from '@grafana/scenes';
import {Spinner, Alert} from '@grafana/ui';
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
    <div {...stylex.props(embeddedDashboardStyles.canvas, controls && embeddedDashboardStyles.canvasWithControls)}>
      {controls && (
        <div {...stylex.props(embeddedDashboardStyles.controlsWrapper)}>
          <controls.Component model={controls} />
        </div>
      )}
      <div {...stylex.props(embeddedDashboardStyles.body)}>
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


