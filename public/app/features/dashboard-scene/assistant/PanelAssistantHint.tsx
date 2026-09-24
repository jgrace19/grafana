import * as stylex from '@stylexjs/stylex';
import { type MouseEvent, useCallback, useContext, useEffect } from 'react';

import { t } from '@grafana/i18n';
import {
  isSceneObject,
  type SceneComponentProps,
  SceneObjectBase,
  type SceneObjectState,
  type SceneObject,
  VizPanel,
  sceneGraph,
} from '@grafana/scenes';
import { Icon } from '@grafana/ui';

import { AssistantPopoverContext } from './AssistantPopoverContext';
import { panelAssistantHintStyles } from './PanelAssistantHint.stylex';

const HINT_KEY_PREFIX = 'assistant-hint-';

export function panelHasData(panel: VizPanel): boolean {
  return panel.state.$data != null || panel.parent?.state.$data != null;
}

export class PanelAssistantHintItem extends SceneObjectBase<SceneObjectState> {
  static Component = PanelAssistantHintRenderer;
}

function PanelAssistantHintRenderer({ model }: SceneComponentProps<PanelAssistantHintItem>) {
  const popoverContext = useContext(AssistantPopoverContext);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      // Walk up the scene object tree to find the parent VizPanel
      let current: SceneObject | undefined = model.parent;
      while (current && !(current instanceof VizPanel)) {
        current = current.parent;
      }

      if (current instanceof VizPanel && popoverContext) {
        // Pass the button element — ViewModePanelPromptCard will walk up the DOM
        // from it to find the panel container for positioning.
        const target: HTMLElement | null = e.currentTarget instanceof HTMLElement ? e.currentTarget : null;
        if (target) {
          popoverContext.openPopover(current, target, e.shiftKey);
        }
      }
    },
    [model, popoverContext]
  );

  return (
    <button
      {...stylex.props(panelAssistantHintStyles.hintButton)}
      onClick={handleClick}
      data-testid="panel-assistant-hint"
      aria-label={t('dashboard.panel-assistant.hint.aria-label', 'Open assistant for this panel')}
      type="button"
    >
      <span {...stylex.props(panelAssistantHintStyles.hintCircle)} />
      <Icon name="ai-sparkle" size="xs" {...stylex.props(panelAssistantHintStyles.hintSparkle)} />
    </button>
  );
}

/**
 * Injects an AI sparkle hint icon into the titleItems of every VizPanel on the dashboard.
 * The icon is hidden by default and revealed on panel hover via CSS.
 */
export function addAssistantHintsToAllPanels(dashboard: SceneObject) {
  const objects = sceneGraph.findAllObjects(dashboard, (obj) => obj instanceof VizPanel);

  for (const obj of objects) {
    if (obj instanceof VizPanel && panelHasData(obj)) {
      addAssistantHintToPanel(obj);
    }
  }
}

export function addAssistantHintToPanel(panel: VizPanel) {
  const key = `${HINT_KEY_PREFIX}${panel.state.key}`;

  const existingItems = panel.state.titleItems;
  if (existingItems) {
    if (Array.isArray(existingItems)) {
      if (existingItems.some((item) => item instanceof PanelAssistantHintItem)) {
        return;
      }
      panel.setState({ titleItems: [...existingItems, new PanelAssistantHintItem({ key })] });
    } else if (existingItems instanceof PanelAssistantHintItem) {
      return;
    } else if (isSceneObject(existingItems)) {
      panel.setState({ titleItems: [existingItems, new PanelAssistantHintItem({ key })] });
    } else {
      panel.setState({ titleItems: new PanelAssistantHintItem({ key }) });
    }
  } else {
    panel.setState({ titleItems: new PanelAssistantHintItem({ key }) });
  }
}

export function removeAssistantHintsFromAllPanels(dashboard: SceneObject) {
  const objects = sceneGraph.findAllObjects(dashboard, (obj) => obj instanceof VizPanel);

  for (const obj of objects) {
    if (obj instanceof VizPanel) {
      removeAssistantHintFromPanel(obj);
    }
  }
}

function removeAssistantHintFromPanel(panel: VizPanel) {
  const existingItems = panel.state.titleItems;
  if (!existingItems) {
    return;
  }

  if (existingItems instanceof PanelAssistantHintItem) {
    panel.setState({ titleItems: undefined });
  } else if (Array.isArray(existingItems)) {
    const filtered = existingItems.filter((item) => !(item instanceof PanelAssistantHintItem));
    panel.setState({ titleItems: filtered.length > 0 ? filtered : undefined });
  }
}

/**
 * Manages the lifecycle of assistant hint icons on dashboard panels.
 * Adds hints in view mode when the assistant popover is enabled, removes them otherwise.
 */
export function useAssistantPanelHints(dashboard: SceneObject, isEditing: boolean | undefined, isEnabled: boolean) {
  useEffect(() => {
    if (!isEditing && isEnabled) {
      addAssistantHintsToAllPanels(dashboard);
      return () => removeAssistantHintsFromAllPanels(dashboard);
    }
    removeAssistantHintsFromAllPanels(dashboard);
    return undefined;
  }, [isEditing, isEnabled, dashboard]);
}

