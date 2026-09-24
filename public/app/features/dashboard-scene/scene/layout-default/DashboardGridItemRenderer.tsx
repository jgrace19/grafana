import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type RefObject, useMemo } from 'react';

import { LazyLoader, type SceneComponentProps, type VizPanel } from '@grafana/scenes';
import { useElementSelection } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN } from 'app/core/constants';

import { useDashboardState } from '../../utils/utils';
import { SoloPanelContextValueWithSearchStringFilter } from '../PanelSearchLayout';
import { renderMatchingSoloPanels, useSoloPanelContext } from '../SoloPanelContext';
import { getIsLazy } from '../layouts-shared/utils';

import { type DashboardGridItem, type RepeatDirection } from './DashboardGridItem';

interface PanelWrapperProps {
  panel: VizPanel;
  isLazy: boolean;
  containerRef?: RefObject<HTMLDivElement>;
  isSelected?: boolean;
}

function PanelWrapper({ panel, isLazy, containerRef, isSelected }: PanelWrapperProps) {
  if (isLazy) {
    return (
      <LazyLoader
        key={panel.state.key!}
        ref={containerRef}
        {...mergeStylexProps(stylex.props(styles.panelWrapper), {
          className: clsx(isSelected && 'dashboard-selected-element'),
        })}
      >
        <panel.Component model={panel} />
      </LazyLoader>
    );
  }
  return (
    <div
      {...mergeStylexProps(stylex.props(styles.panelWrapper), {
        className: clsx(isSelected && 'dashboard-selected-element'),
      })}
      ref={containerRef}
    >
      <panel.Component model={panel} />
    </div>
  );
}

export function DashboardGridItemRenderer({ model }: SceneComponentProps<DashboardGridItem>) {
  const { repeatedPanels = [], itemHeight, variableName, body } = model.useState();
  const soloPanelContext = useSoloPanelContext();
  const { preload } = useDashboardState(model);
  const isLazy = useMemo(() => getIsLazy(preload), [preload]);
  const { isSelected: isSourceSelected } = useElementSelection(body.state.key);
  const layoutStyle = useLayoutStyle(
    model.getRepeatDirection(),
    model.getChildCount(),
    model.getMaxPerRow(),
    itemHeight ?? 10
  );

  if (soloPanelContext) {
    // Use lazy loading only for panel search layout (SoloPanelContextValueWithSearchStringFilter)
    // as it renders multiple panels in a grid. Skip lazy loading for viewPanel URL param
    // (SoloPanelContextWithPathIdFilter) since single panels should render immediately.
    const useLazyForSoloPanel = isLazy && soloPanelContext instanceof SoloPanelContextValueWithSearchStringFilter;
    return renderMatchingSoloPanels(soloPanelContext, [body, ...repeatedPanels], useLazyForSoloPanel);
  }

  if (!variableName) {
    return <PanelWrapper panel={body} isLazy={isLazy} containerRef={model.containerRef} />;
  }

  return (
    <div {...stylex.props(layoutStyle)} ref={model.containerRef}>
      <PanelWrapper panel={body} isLazy={isLazy} />
      {repeatedPanels.map((panel) => (
        <PanelWrapper key={panel.state.key!} panel={panel} isLazy={isLazy} isSelected={isSourceSelected} />
      ))}
    </div>
  );
}

function useLayoutStyle(direction: RepeatDirection, itemCount: number, maxPerRow: number, itemHeight: number) {
  return useMemo(() => {
    // In mobile responsive layout we have to calculate the absolute height
    const mobileHeight = itemHeight * GRID_CELL_HEIGHT * itemCount + (itemCount - 1) * GRID_CELL_VMARGIN;

    if (direction === 'h') {
      const rowCount = Math.ceil(itemCount / maxPerRow);
      const columnCount = Math.min(itemCount, maxPerRow);

      return styles.horizontalRepeat(`repeat(${columnCount}, 1fr)`, `repeat(${rowCount}, 1fr)`, mobileHeight);
    }

    // Vertical is a bit simpler
    return styles.verticalRepeat(mobileHeight);
  }, [direction, itemCount, maxPerRow, itemHeight]);
}

const styles = stylex.create({
  horizontalRepeat: (templateColumns: string, templateRows: string, mobileHeight: number) => ({
    display: { default: 'grid', [bp.mdDown]: 'flex' },
    flexDirection: { default: null, [bp.mdDown]: 'column' },
    height: { default: '100%', [bp.mdDown]: mobileHeight },
    width: '100%',
    gridTemplateColumns: templateColumns,
    gridTemplateRows: templateRows,
    columnGap: spacing['--gf-spacing-x1'],
    rowGap: spacing['--gf-spacing-x1'],
  }),
  verticalRepeat: (mobileHeight: number) => ({
    display: 'flex',
    height: { default: '100%', [bp.mdDown]: mobileHeight },
    width: '100%',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
  }),
  panelWrapper: {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});
