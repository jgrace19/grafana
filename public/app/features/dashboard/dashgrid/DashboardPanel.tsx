import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { type StoreState } from 'app/types/store';

import { initPanelState } from '../../panel/state/actions';
import { setPanelInstanceState } from '../../panel/state/reducers';
import { type DashboardModel } from '../state/DashboardModel';
import { type PanelModel } from '../state/PanelModel';

import { LazyLoader } from './LazyLoader';
import { PanelStateWrapper } from './PanelStateWrapper';

export interface OwnProps {
  panel: PanelModel;
  stateKey: string;
  dashboard: DashboardModel;
  isEditing: boolean;
  isViewing: boolean;
  isDraggable?: boolean;
  width: number;
  height: number;
  lazy?: boolean;
  timezone?: string;
  hideMenu?: boolean;
}

export function DashboardPanel({
  panel,
  stateKey,
  dashboard,
  isEditing,
  isViewing,
  isDraggable = true,
  width,
  height,
  lazy = true,
  timezone,
  hideMenu,
}: OwnProps) {
  const dispatch = useDispatch();
  const panelState = useSelector((state: StoreState) => state.panels[stateKey]);
  const plugin = panelState?.plugin;
  const instanceState = panelState?.instanceState;

  useEffect(() => {
    panel.isInView = !lazy;
    if (!lazy) {
      if (!plugin) {
        dispatch(initPanelState(panel));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInstanceStateChange = (value: unknown) => {
    dispatch(setPanelInstanceState({ key: stateKey, value }));
  };

  const onVisibilityChange = (v: boolean) => {
    panel.isInView = v;
  };

  const onPanelLoad = () => {
    if (!plugin) {
      dispatch(initPanelState(panel));
    }
  };

  const renderPanel = ({ isInView }: { isInView: boolean }) => {
    if (!plugin) {
      return null;
    }

    return (
      <PanelStateWrapper
        plugin={plugin}
        panel={panel}
        dashboard={dashboard}
        isViewing={isViewing}
        isEditing={isEditing}
        isInView={isInView}
        isDraggable={isDraggable}
        width={width}
        height={height}
        onInstanceStateChange={onInstanceStateChange}
        timezone={timezone}
        hideMenu={hideMenu}
      />
    );
  };

  return lazy ? (
    <LazyLoader width={width} height={height} onChange={onVisibilityChange} onLoad={onPanelLoad}>
      {renderPanel}
    </LazyLoader>
  ) : (
    renderPanel({ isInView: true })
  );
}

export const DashboardPanelUnconnected = DashboardPanel;
