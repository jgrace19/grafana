import { type GrafanaTheme2 } from '@grafana/data';

export function getGlobalStylesCss(theme: GrafanaTheme2): string {
  const inputBorder = theme.components.input.borderColor;
  const inputHover = theme.components.input.borderHover;
  const radius = theme.shape.radius.default;
  const bgSecondary = theme.colors.background.secondary;
  const primaryBorder = theme.colors.primary.border;
  const minNodeHeight = theme.spacing.gridSize * 4;

  return `
    .moveable-control-box { z-index: 999; }
    .rc-tree { margin: 0 0 15px; border: 1px solid transparent; }
    .rc-tree-focused:not(.rc-tree-active-focused) { border-color: cyan; }
    .rc-tree .rc-tree-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .rc-tree .rc-tree-treenode {
      margin: 0 0 3px;
      padding: 1px;
      line-height: 24px;
      white-space: nowrap;
      list-style: none;
      outline: 0;
      display: flex;
      cursor: pointer;
    }
    .rc-tree .rc-tree-node-content-wrapper {
      position: relative;
      display: inline-block;
      height: 24px;
      margin: 0;
      padding: 0;
      text-decoration: none;
      vertical-align: top;
      cursor: grab;
      flex-grow: 1;
      border: 1px solid ${inputBorder};
      border-radius: ${radius};
      background: ${bgSecondary};
      min-height: ${minNodeHeight}px;
    }
    .rc-tree .rc-tree-node-content-wrapper:hover {
      border: 1px solid ${inputHover};
    }
    .rc-tree .rc-tree-node-content-wrapper.rc-tree-node-selected {
      border: 1px solid ${primaryBorder};
      opacity: 1;
    }
    .rc-tree .rc-tree-treenode.drop-container ~ .rc-tree-treenode {
      border-left: 2px solid ${inputBorder};
    }
    .rc-tree .rc-tree-treenode.drop-target ~ .rc-tree-treenode {
      border-left: none;
    }
    .rc-tree .rc-tree-treenode.filter-node > .rc-tree-node-content-wrapper {
      color: #a60000 !important;
      font-weight: bold !important;
    }
    .rc-tree .rc-tree-child-tree { display: none; }
    .rc-tree .rc-tree-child-tree-open { display: block; }
  `;
}
