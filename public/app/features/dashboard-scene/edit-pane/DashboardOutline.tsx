import * as stylex from '@stylexjs/stylex';
import React, { useMemo, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { type SceneObject } from '@grafana/scenes';
import { Box, Icon, ScrollContainer, Sidebar, Text, useElementSelection, useTheme2 } from '@grafana/ui';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
  const theme = useTheme2();
  const emphasizedBackground = theme.colors.emphasize(theme.colors.background.primary, 0.05);
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
      {...stylex.props(styles.container)}
      onClick={onNodeClicked}
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      style={{ '--depth': depth } as React.CSSProperties}
    >
      <div
        {...stylex.props(
          styles.row,
          isEditing ? styles.rowEditMode(emphasizedBackground) : styles.rowViewMode,
          isSelected && styles.rowSelected(emphasizedBackground)
        )}
      >
        <div {...stylex.props(styles.indentation)}></div>
        {isContainer && (
          <button
            {...stylex.props(styles.angleButton)}
            onClick={onToggleCollapse}
            data-testid={selectors.components.PanelEditor.Outline.node(instanceName)}
          >
            <Icon name={isCollapsed ? 'angle-right' : 'angle-down'} />
          </button>
        )}
        <button
          {...stylex.props(styles.nodeButton, isCloned && styles.nodeButtonClone)}
          onDoubleClick={outlineRename.onNameDoubleClicked}
          data-testid={selectors.components.PanelEditor.Outline.item(instanceName)}
        >
          <Icon size="sm" name={elementInfo.icon} />
          {outlineRename.isRenaming ? (
            <input
              ref={outlineRename.renameInputRef}
              type="text"
              value={elementInfo.instanceName}
              {...stylex.props(styles.outlineInput)}
              onChange={outlineRename.onChangeName}
              onBlur={outlineRename.onInputBlur}
              onKeyDown={outlineRename.onInputKeyDown}
            />
          ) : (
            <>
              <div {...stylex.props(styles.nodeName)}>
                <Text truncate>{instanceName}</Text>
                {elementInfo.isHidden && <Icon name="eye-slash" size="sm" xstyle={styles.hiddenIcon} />}
              </div>
              {isCloned && (
                <span {...stylex.props(styles.nodeButtonLabel)}>
                  <Trans i18nKey="dashboard.outline.repeated-item">Repeat</Trans>
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {isContainer && !isCollapsed && (
        <ul {...stylex.props(styles.nodeChildren)} role="group">
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
              {...stylex.props(styles.container)}
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              style={{ '--depth': depth + 1 } as React.CSSProperties}
            >
              <div {...stylex.props(styles.row)}>
                <div {...stylex.props(styles.indentation)}></div>
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

const styles = stylex.create({
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
    flexGrow: 1,
    flexDirection: 'column',
    borderRadius: shape['--gf-shape-radius-default'],
    color: colors['--gf-colors-text-secondary'],
  },
  row: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  rowEditMode: (hoverBackground: string) => ({
    color: { default: null, ':hover': colors['--gf-colors-text-primary'] },
    outlineWidth: { default: null, ':hover': '1px' },
    outlineStyle: { default: null, ':hover': 'dashed' },
    outlineColor: { default: null, ':hover': colors['--gf-colors-border-strong'] },
    backgroundColor: { default: null, ':hover': hoverBackground },
  }),
  rowViewMode: {
    textDecoration: { default: null, ':hover': 'underline' },
  },
  rowSelected: (background: string) => ({
    color: colors['--gf-colors-text-primary'],
    outlineWidth: '1px',
    outlineStyle: 'dashed',
    outlineColor: colors['--gf-colors-primary-border'],
    backgroundColor: background,
  }),
  indentation: {
    marginLeft: `calc(var(--depth) * ${spacing['--gf-spacing-x3']})`,
  },
  angleButton: {
    // Keeps the global `button:focus-visible` ring, which used to beat the Emotion `box-shadow: none`.
    boxShadow: { default: null, ':not(:focus-visible)': 'none' },
    borderStyle: 'none',
    backgroundColor: 'transparent',
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    color: 'inherit',
    lineHeight: 0,
  },
  nodeButton: {
    boxShadow: { default: null, ':not(:focus-visible)': 'none' },
    borderStyle: 'none',
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderRadius: shape['--gf-shape-radius-default'],
    color: 'inherit',
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
  },
  nodeButtonLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nodeName: {
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
    flexGrow: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  hiddenIcon: {
    color: colors['--gf-colors-text-secondary'],
    marginLeft: spacing['--gf-spacing-x1'],
  },
  nodeButtonClone: {
    color: colors['--gf-colors-text-secondary'],
  },
  outlineInput: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-input-border-color'],
    height: spacing['--gf-spacing-x3'],
    borderRadius: shape['--gf-shape-radius-default'],
    outlineStyle: { default: null, ':focus': 'none' },
    boxShadow: { default: null, ':focus': 'none' },
  },
  nodeChildren: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    gap: spacing['--gf-spacing-x0-5'],
    // tree line
    '::before': {
      content: '""',
      position: 'absolute',
      width: '1px',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      backgroundColor: colors['--gf-colors-border-weak'],
      marginLeft: `calc(11px + ${spacing['--gf-spacing-x3']} * var(--depth))`,
    },
  },
});
