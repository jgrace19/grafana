import classNames from 'classnames';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import ReactGridLayout, { type ItemCallback } from 'react-grid-layout';
import { Subscription } from 'rxjs';

import { config } from '@grafana/runtime';
import { appEvents } from 'app/core/app_events';
import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN, GRID_COLUMN_COUNT } from 'app/core/constants';
import { contextSrv } from 'app/core/services/context_srv';
import { VariablesChanged } from 'app/features/variables/types';
import { DashboardPanelsChangedEvent } from 'app/types/events';

import { AddLibraryPanelWidget } from '../components/AddLibraryPanelWidget/AddLibraryPanelWidget';
import { DashboardRow } from '../components/DashboardRow/DashboardRow';
import { type DashboardModel } from '../state/DashboardModel';
import { type GridPos, type PanelModel } from '../state/PanelModel';

import DashboardEmpty from './DashboardEmpty/DashboardEmpty';
import { DashboardPanel } from './DashboardPanel';

export const PANEL_FILTER_VARIABLE = 'systemPanelFilterVar';

export interface Props {
  dashboard: DashboardModel;
  isEditable: boolean;
  editPanel: PanelModel | null;
  viewPanel: PanelModel | null;
  hidePanelMenus?: boolean;
}

export function DashboardGrid({ dashboard, isEditable, editPanel, viewPanel, hidePanelMenus }: Props) {
  const [panelFilter, setPanelFilterState] = useState<RegExp | undefined>(undefined);
  const [width, setWidth] = useState(document.body.clientWidth);
  const [, forceUpdate] = useState(0);

  const panelMapRef = useRef<{ [key: string]: PanelModel }>({});
  const windowHeightRef = useRef(1200);
  const windowWidthRef = useRef(1920);
  const gridWidthRef = useRef(0);
  const lastPanelBottomRef = useRef(0);
  const isLayoutInitializedRef = useRef(false);

  const setPanelFilter = (regex: string) => {
    let filter = undefined;
    if (regex.length > 0) {
      filter = new RegExp(regex, 'i');
    }
    setPanelFilterState(filter);
  };

  useEffect(() => {
    const eventSubs = new Subscription();

    if (config.featureToggles.panelFilterVariable) {
      for (const variable of dashboard.getVariables()) {
        if (variable.id === PANEL_FILTER_VARIABLE) {
          if ('query' in variable) {
            setPanelFilter(variable.query as string);
          }
          break;
        }
      }

      eventSubs.add(
        appEvents.subscribe(VariablesChanged, (e) => {
          if (e.payload.variable?.id === PANEL_FILTER_VARIABLE) {
            if ('current' in e.payload.variable) {
              const variable = e.payload.variable.current;
              if ('value' in variable && typeof variable.value === 'string') {
                setPanelFilter(variable.value);
              }
            }
          }
        })
      );
    }

    eventSubs.add(
      dashboard.events.subscribe(DashboardPanelsChangedEvent, () => {
        forceUpdate((c) => c + 1);
      })
    );

    return () => eventSubs.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard]);

  const buildLayout = () => {
    const layout: ReactGridLayout.Layout[] = [];
    panelMapRef.current = {};

    let count = 0;
    for (const panel of dashboard.panels) {
      if (!panel.key) {
        panel.key = `panel-${panel.id}-${Date.now()}`;
      }
      panel.title = panel.title?.substring(0, 5000);
      panelMapRef.current[panel.key] = panel;

      if (!panel.gridPos) {
        console.log('panel without gridpos');
        continue;
      }

      const panelPos: ReactGridLayout.Layout = {
        i: panel.key,
        x: panel.gridPos.x,
        y: panel.gridPos.y,
        w: panel.gridPos.w,
        h: panel.gridPos.h,
      };

      if (panel.type === 'row') {
        panelPos.w = GRID_COLUMN_COUNT;
        panelPos.h = 1;
        panelPos.isResizable = false;
        panelPos.isDraggable = panel.collapsed;
      }

      if (!panelFilter) {
        layout.push(panelPos);
      } else {
        if (panelFilter.test(panel.title)) {
          panelPos.isResizable = false;
          panelPos.isDraggable = false;
          panelPos.x = (count % 2) * GRID_COLUMN_COUNT;
          panelPos.y = Math.floor(count / 2);
          layout.push(panelPos);
          count++;
        }
      }
    }

    return layout;
  };

  const onLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    if (panelFilter) {
      return;
    }
    for (const newPos of newLayout) {
      panelMapRef.current[newPos.i!].updateGridPos(newPos, isLayoutInitializedRef.current);
    }

    if (isLayoutInitializedRef.current) {
      isLayoutInitializedRef.current = true;
    }

    dashboard.sortPanelsByGridPos();
    forceUpdate((c) => c + 1);
  };

  const updateGridPos = (item: ReactGridLayout.Layout) => {
    panelMapRef.current[item.i!].updateGridPos(item);
  };

  const onResize: ItemCallback = (layout, oldItem, newItem) => {
    const panel = panelMapRef.current[newItem.i!];
    panel.updateGridPos(newItem);
  };

  const onResizeStop: ItemCallback = (layout, oldItem, newItem) => {
    updateGridPos(newItem);
  };

  const onDragStop: ItemCallback = (layout, oldItem, newItem) => {
    updateGridPos(newItem);
  };

  const getPanelScreenPos = (panel: PanelModel, gridWidth: number): { top: number; bottom: number } => {
    let top = 0;

    if (gridWidth < config.theme2.breakpoints.values.md) {
      top = lastPanelBottomRef.current + GRID_CELL_VMARGIN;
    } else {
      top = translateGridHeightToScreenHeight(panel.gridPos.y) + GRID_CELL_VMARGIN;
    }

    lastPanelBottomRef.current = top + translateGridHeightToScreenHeight(panel.gridPos.h);

    return { top, bottom: lastPanelBottomRef.current };
  };

  const renderPanel = (panel: PanelModel, panelWidth: number, panelHeight: number, isDraggable: boolean) => {
    if (panel.type === 'row') {
      return <DashboardRow key={panel.key} panel={panel} dashboard={dashboard} />;
    }

    if (panel.type === 'add-library-panel') {
      return <AddLibraryPanelWidget key={panel.key} panel={panel} dashboard={dashboard} />;
    }

    return (
      <DashboardPanel
        key={panel.key}
        stateKey={panel.key}
        panel={panel}
        dashboard={dashboard}
        isEditing={panel.isEditing}
        isViewing={panel.isViewing}
        isDraggable={isDraggable}
        width={panelWidth}
        height={panelHeight}
        hideMenu={hidePanelMenus}
      />
    );
  };

  const renderPanels = (gridWidth: number, isDashboardDraggable: boolean) => {
    const panelElements = [];

    // Reset last panel bottom
    lastPanelBottomRef.current = 0;

    if (gridWidthRef.current !== gridWidth) {
      windowHeightRef.current = window.innerHeight ?? 1000;
      windowWidthRef.current = window.innerWidth;
      gridWidthRef.current = gridWidth;
    }

    for (const panel of dashboard.panels) {
      const panelClasses = classNames({ 'react-grid-item--fullscreen': panel.isViewing });

      const p = (
        <GrafanaGridItem
          key={panel.key}
          className={panelClasses}
          data-panelid={panel.id}
          gridPos={panel.gridPos}
          gridWidth={gridWidth}
          windowHeight={windowHeightRef.current}
          windowWidth={windowWidthRef.current}
          isViewing={panel.isViewing}
        >
          {(panelWidth: number, panelHeight: number) => {
            return renderPanel(panel, panelWidth, panelHeight, isDashboardDraggable);
          }}
        </GrafanaGridItem>
      );

      if (!panelFilter) {
        panelElements.push(p);
      } else {
        if (panelFilter.test(panel.title)) {
          panelElements.push(p);
        }
      }
    }

    return panelElements;
  };

  if (dashboard.panels.length === 0) {
    return <DashboardEmpty dashboard={dashboard} canCreate={isEditable} />;
  }

  const draggable = width <= config.theme2.breakpoints.values.md ? false : isEditable;

  return (
    <div
      ref={(rootEl) => {
        if (!rootEl) {
          return;
        }

        const observer = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            setWidth(entry.contentRect.width);
          });
        });
        observer.observe(rootEl);
      }}
      style={{
        flex: '1 1 auto',
        position: 'relative',
        zIndex: 1,
        display: editPanel ? 'none' : undefined,
      }}
    >
      <div
        style={{ width: width, height: '100%' }}
        ref={(ref) => {
          if (ref && contextSrv.user.authenticatedBy !== 'render') {
            setTimeout(() => {
              ref.classList.add('react-grid-layout--enable-move-animations');
            }, 50);
          }
        }}
      >
        <ReactGridLayout
          width={width}
          isDraggable={draggable}
          isResizable={isEditable}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
          margin={[GRID_CELL_VMARGIN, GRID_CELL_VMARGIN]}
          cols={GRID_COLUMN_COUNT}
          rowHeight={GRID_CELL_HEIGHT}
          draggableHandle=".grid-drag-handle"
          draggableCancel=".grid-drag-cancel"
          layout={buildLayout()}
          onDragStop={onDragStop}
          onResize={onResize}
          onResizeStop={onResizeStop}
          onLayoutChange={onLayoutChange}
        >
          {renderPanels(width, draggable)}
        </ReactGridLayout>
      </div>
    </div>
  );
}

interface GrafanaGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  gridWidth?: number;
  gridPos?: GridPos;
  isViewing: boolean;
  windowHeight: number;
  windowWidth: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

/**
 * A hacky way to intercept the react-layout-grid item dimensions and pass them to DashboardPanel
 */
const GrafanaGridItem = React.forwardRef<HTMLDivElement, GrafanaGridItemProps>((props, ref) => {
  const theme = config.theme2;
  let width = 100;
  let height = 100;

  const { gridWidth, gridPos, isViewing, windowHeight, windowWidth, ...divProps } = props;
  const style: CSSProperties = props.style ?? {};

  if (isViewing) {
    width = gridWidth!;
    height = windowHeight * 0.85;
    style.height = height;
    style.width = '100%';
  } else if (windowWidth < theme.breakpoints.values.md) {
    width = props.gridWidth!;
    height = translateGridHeightToScreenHeight(gridPos!.h);
    style.height = height;
    style.width = '100%';
  } else {
    if (props.style) {
      const { width: styleWidth, height: styleHeight } = props.style;
      if (styleWidth != null) {
        width = typeof styleWidth === 'number' ? styleWidth : parseFloat(styleWidth);
      }
      if (styleHeight != null) {
        height = typeof styleHeight === 'number' ? styleHeight : parseFloat(styleHeight);
      }
    }
  }

  return (
    <div {...divProps} style={{ ...divProps.style }} ref={ref}>
      {[props.children[0](width, height), props.children.slice(1)]}
    </div>
  );
});

/**
 * This translates grid height dimensions to real pixels
 */
function translateGridHeightToScreenHeight(gridHeight: number): number {
  return gridHeight * (GRID_CELL_HEIGHT + GRID_CELL_VMARGIN) - GRID_CELL_VMARGIN;
}

GrafanaGridItem.displayName = 'GridItemWithDimensions';
