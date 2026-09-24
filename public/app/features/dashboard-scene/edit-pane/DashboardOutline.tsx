import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardOutlineStyles } from './DashboardOutline.stylex';
import React, { useMemo, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { type SceneObject } from '@grafana/scenes';
import {Box, Icon, ScrollContainer, Sidebar, Text, useElementSelection} from '@grafana/ui';

import { DashboardLinksSet } from '../settings/links/DashboardLinksSet';
import { LinkEdit } from '../settings/links/LinkAddEditableElement';
import { isRepeatCloneOrChildOf } from '../utils/clone';
import { DashboardInteractions } from '../utils/interactions';
import { getDashboardSceneFor } from '../utils/utils';

import { type DashboardEditPane } from './DashboardEditPane';
import { getEditableElementFor } from './shared';
import { useOutlineRename } from './useOutlineRename';

export interface Props {
  editPane: DashboardEditPane;
  isEditing: boolean | undefined;
}

export function DashboardOutline({ editPane, isEditing }: Props) {
  const dashboard = getDashboardSceneFor(editPane);

  return (
    <Box display="flex" direction="column" flex={1} height="100%">
      <Sidebar.PaneHeader title={t('dashboard.outline.pane-header', 'Content outline')} />
      <ScrollContainer showScrollIndicators={true}>
        <Box padding={1} gap={0} display="flex" direction="column" element="ul" role="tree" position="relative">
          <DashboardOutlineNode sceneObject={dashboard} isEditing={isEditing} editPane={editPane} depth={0} index={0} />
        </Box>
      </ScrollContainer>
    </Box>
  );
}

interface DashboardOutlineNodeProps {
  sceneObject: SceneObject;
  editPane: DashboardEditPane;
  isEditing: boolean | undefined;
  depth: number;
  index: number;
}

function DashboardOutlineNode({ sceneObject, editPane, isEditing, depth, index }: DashboardOutlineNodeProps) {

  const key = sceneObject.state.key;
  const [isCollapsed, setIsCollapsed] = useState(depth > 0);
  const { isSelected, onSelect } = useElementSelection(key);
  const isCloned = useMemo(() => isRepeatCloneOrChildOf(sceneObject), [sceneObject]);
  const editableElement = useMemo(() => getEditableElementFor(sceneObject)!, [sceneObject]);

  const noTitleText = t('dashboard.outline.tree-item.no-title', '<no title>');

  const elementInfo = editableElement.getEditableElementInfo();
  const instanceName = elementInfo.instanceName === '' ? noTitleText : elementInfo.instanceName;
  const outlineRename = useOutlineRename(editableElement, isEditing);
  const isContainer = editableElement.getOutlineChildren ? true : false;
  const outlineChildren = editableElement.getOutlineChildren?.(isEditing) ?? [];
  const visibleChildren = isEditing
    ? outlineChildren
    : outlineChildren.filter((child) => !getEditableElementFor(child)?.getEditableElementInfo().isHidden);

  const onNodeClicked = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSelected) {
      if (sceneObject instanceof LinkEdit || sceneObject instanceof DashboardLinksSet) {
        // Select directly via editPane.selectObject because link objects are not
        // in the scene graph, so sceneGraph.findByKey (used by onSelect) can't find them.
        editPane.selectObject(sceneObject);
      } else {
        onSelect?.(e);
      }
    }

    editableElement.scrollIntoView?.();
    DashboardInteractions.outlineItemClicked({ index, depth, isEditing });
  };

  const onToggleCollapse = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  if (elementInfo.isHidden && !isEditing) {
    return null;
  }

  return (
    // todo: add proper keyboard navigation
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      role="treeitem"
      aria-selected={isSelected}
      {...stylex.props(dashboardOutlineStyles.container)}
      onClick={onNodeClicked}
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      style={{ '--depth': depth } as React.CSSProperties}
    >
      <div
        {...mergeStylexClassName(stylex.props(dashboardOutlineStyles.row), clsx(isEditing ? dashboardOutlineStyles.rowEditMode : dashboardOutlineStyles.rowViewMode, {
          [dashboardOutlineStyles.rowSelected]: isSelected,
        }))}
      >
        <div {...stylex.props(dashboardOutlineStyles.indentation)}></div>
        {isContainer && (
          <button
            {...stylex.props(dashboardOutlineStyles.angleButton)}
            onClick={onToggleCollapse}
            data-testid={selectors.components.PanelEditor.Outline.node(instanceName)}
          >
            <Icon name={isCollapsed ? 'angle-right' : 'angle-down'} />
          </button>
        )}
        <button
          {...stylex.props(dashboardOutlineStyles.nodeButton, isCloned  && dashboardOutlineStyles.nodeButtonClone)}
          onDoubleClick={outlineRename.onNameDoubleClicked}
          data-testid={selectors.components.PanelEditor.Outline.item(instanceName)}
        >
          <Icon size="sm" name={elementInfo.icon} />
          {outlineRename.isRenaming ? (
            <input
              ref={outlineRename.renameInputRef}
              type="text"
              value={elementInfo.instanceName}
              {...stylex.props(dashboardOutlineStyles.outlineInput)}
              onChange={outlineRename.onChangeName}
              onBlur={outlineRename.onInputBlur}
              onKeyDown={outlineRename.onInputKeyDown}
            />
          ) : (
            <>
              <div {...stylex.props(dashboardOutlineStyles.nodeName)}>
                <Text truncate>{instanceName}</Text>
                {elementInfo.isHidden && <Icon name="eye-slash" size="sm" {...stylex.props(dashboardOutlineStyles.hiddenIcon)} />}
              </div>
              {isCloned && (
                <span>
                  <Trans i18nKey="dashboard.outline.repeated-item">Repeat</Trans>
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {isContainer && !isCollapsed && (
        <ul {...stylex.props(dashboardOutlineStyles.nodeChildren)} role="group">
          {visibleChildren.length > 0 ? (
            visibleChildren.map((child, i) => (
              <DashboardOutlineNode
                key={child.state.key}
                sceneObject={child}
                editPane={editPane}
                depth={depth + 1}
                isEditing={isEditing}
                index={i}
              />
            ))
          ) : (
            <li
              role="treeitem"
              aria-selected={isSelected}
              {...stylex.props(dashboardOutlineStyles.container)}
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              style={{ '--depth': depth + 1 } as React.CSSProperties}
            >
              <div {...stylex.props(dashboardOutlineStyles.row)}>
                <div {...stylex.props(dashboardOutlineStyles.indentation)}></div>
                <Text color="secondary" italic>
                  <Trans i18nKey="dashboard.outline.tree-item.empty">(empty)</Trans>
                </Text>
              </div>
            </li>
          )}
        </ul>
      )}
    </li>
  );
}


