import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';

import { colorBarCellStyles } from './ColorBarCell.stylex';
import { type FlameGraphDataContainer } from '../FlameGraph/dataTransform';
import { type ColorScheme, type ColorSchemeDiff } from '../types';

import { type CallTreeNode, getRowBarColor } from './utils';

export function ColorBarCell({
  node,
  data,
  colorScheme,
  theme,
  focusedNode,
}: {
  node: CallTreeNode;
  data: FlameGraphDataContainer;
  colorScheme: ColorScheme | ColorSchemeDiff;
  theme: GrafanaTheme2;
  focusedNode?: CallTreeNode;
}) {
  const barColor = getRowBarColor(node, data, colorScheme, theme);

  let barWidth: string;

  if (focusedNode) {
    if (node.id === focusedNode.parentId) {
      barWidth = '0%';
    } else {
      const relativePercent = focusedNode.total > 0 ? (node.total / focusedNode.total) * 100 : 0;
      barWidth = `${Math.min(relativePercent, 100)}%`;
    }
  } else {
    barWidth = `${Math.min(node.totalPercent, 100)}%`;
  }

  return (
    <div {...stylex.props(colorBarCellStyles.colorBarContainer)}>
      <div {...stylex.props(colorBarCellStyles.colorBar)} style={{ width: barWidth, backgroundColor: barColor }} />
    </div>
  );
}

