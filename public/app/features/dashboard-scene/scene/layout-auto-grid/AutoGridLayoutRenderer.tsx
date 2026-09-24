import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { type SceneComponentProps, sceneGraph } from '@grafana/scenes';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { isRepeatCloneOrChildOf } from '../../utils/clone';
import { getTestIdForLayout } from '../../utils/test-utils';
import { useDashboardState } from '../../utils/utils';
import { useSoloPanelContext } from '../SoloPanelContext';
import { CanvasGridAddActions } from '../layouts-shared/CanvasGridAddActions';
import { DASHBOARD_DROP_TARGET_KEY_ATTR } from '../types/DashboardDropTarget';

import { type AutoGridLayout, type AutoGridLayoutState } from './AutoGridLayout';
import { AutoGridLayoutManager } from './AutoGridLayoutManager';

import '../layouts-shared/canvasControls.global.css';
export function AutoGridLayoutRenderer({ model }: SceneComponentProps<AutoGridLayout>) {
  const { children, isHidden } = model.useState();
  const {
    layoutOrchestrator,
    isEditing,
    meta: { isEmbedded },
  } = useDashboardState(model);
  const layoutManager = sceneGraph.getAncestor(model, AutoGridLayoutManager);
  const { fillScreen, dropPosition } = layoutManager.useState();
  const soloPanelContext = useSoloPanelContext();

  if (isHidden || !layoutOrchestrator) {
    return null;
  }

  const showCanvasActions = !isEmbedded && !isRepeatCloneOrChildOf(model) && isEditing;

  if (soloPanelContext) {
    return children.map((item) => <item.Component key={item.state.key} model={item} />);
  }

  // Build children with placeholder inserted at dropPosition
  const renderChildren = () => {
    if (dropPosition === null || dropPosition === undefined) {
      return children.map((item) => <item.Component key={item.state.key} model={item} />);
    }

    const result: React.ReactNode[] = [];
    const insertPosition = Math.min(dropPosition, children.length);

    for (let i = 0; i <= children.length; i++) {
      if (i === insertPosition) {
        result.push(<DropPlaceholder key="drop-placeholder" />);
      }
      if (i < children.length) {
        const item = children[i];
        result.push(<item.Component key={item.state.key} model={item} />);
      }
    }

    return result;
  };

  return (
    <div
      data-testid={selectors.components.LayoutContainer(getTestIdForLayout(model))}
      {...mergeStylexProps(
        stylex.props(
          styles.container,
          gridStyles(model.state),
          fillScreen && styles.containerFillScreen,
          isEditing && styles.containerEditing
        ),
        { className: 'gf-auto-grid-layout' }
      )}
      ref={model.containerRef}
      {...{ [DASHBOARD_DROP_TARGET_KEY_ATTR]: layoutManager.state.key }}
    >
      {renderChildren()}
      {showCanvasActions && <CanvasGridAddActions layoutManager={layoutManager} />}
    </div>
  );
}

function DropPlaceholder() {
  return <div {...stylex.props(styles.dropPlaceholder)} />;
}

function gridSpacing(units: number) {
  return `calc(var(--gf-spacing-grid-size) * ${units})`;
}

// theme.spacing(state.md.rowGap) for both md gaps is deliberate parity with the Emotion version.
function gridStyles(state: AutoGridLayoutState) {
  const { md } = state;
  return styles.grid(
    state.templateColumns ?? null,
    state.templateRows || null,
    state.autoRows || null,
    gridSpacing(state.rowGap ?? 1),
    gridSpacing(state.columnGap ?? 1),
    state.justifyItems || null,
    state.alignItems || null,
    state.justifyContent || null,
    md?.templateRows ?? null,
    md?.templateColumns ?? null,
    md?.rowGap ? gridSpacing(md.rowGap ?? 1) : null,
    md?.columnGap ? gridSpacing(md.rowGap ?? 1) : null,
    md?.justifyItems ?? null,
    md?.alignItems ?? null,
    md?.justifyContent ?? null
  );
}

// `null` leaves a property unset, like the Emotion version's `'unset'` / omitted md values. The canvas add-actions
// hover rule lives in layouts-shared/canvasControls.global.css.
const styles = stylex.create({
  container: {
    display: 'grid',
    position: 'relative',
  },
  grid: (
    templateColumns: string | number | null,
    templateRows: string | number | null,
    autoRows: string | number | null,
    rowGap: string,
    columnGap: string,
    justifyItems: string | null,
    alignItems: string | null,
    justifyContent: string | null,
    mdTemplateRows: string | number | null,
    mdTemplateColumns: string | number | null,
    mdRowGap: string | null,
    mdColumnGap: string | null,
    mdJustifyItems: string | null,
    mdAlignItems: string | null,
    mdJustifyContent: string | null
  ) => ({
    gridTemplateColumns: { default: templateColumns, [bp.mdDown]: mdTemplateColumns },
    gridTemplateRows: { default: templateRows, [bp.mdDown]: mdTemplateRows },
    gridAutoRows: autoRows,
    rowGap: { default: rowGap, [bp.mdDown]: mdRowGap },
    columnGap: { default: columnGap, [bp.mdDown]: mdColumnGap },
    justifyItems: { default: justifyItems, [bp.mdDown]: mdJustifyItems },
    alignItems: { default: alignItems, [bp.mdDown]: mdAlignItems },
    justifyContent: { default: justifyContent, [bp.mdDown]: mdJustifyContent },
  }),
  containerFillScreen: { flexGrow: 1 },
  containerEditing: { paddingBottom: spacing['--gf-spacing-x5'], position: 'relative' },
  dropPlaceholder: {
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: colors['--gf-colors-primary-main'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-primary-transparent'],
    minHeight: '100px',
  },
});
