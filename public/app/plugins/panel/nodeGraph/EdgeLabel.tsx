import * as stylex from '@stylexjs/stylex';
import { edgeLabelStyles } from './EdgeLabel.stylex';

import { memo, type JSX } from 'react';


import { nodeR } from './Node';
import { type EdgeDatumLayout } from './types';
import { shortenLine } from './utils';

;

interface Props {
  edge: EdgeDatumLayout;
}
export const EdgeLabel = memo(function EdgeLabel(props: Props) {
  const { edge } = props;
  // Not great typing, but after we do layout these properties are full objects not just references
  const { source, target, sourceNodeRadius, targetNodeRadius } = edge;

  // As the nodes have some radius we want edges to end outside the node circle.
  const line = shortenLine(
    {
      x1: source.x!,
      y1: source.y!,
      x2: target.x!,
      y2: target.y!,
    },
    sourceNodeRadius || nodeR,
    targetNodeRadius || nodeR
  );

  const middle = {
    x: line.x1 + (line.x2 - line.x1) / 2,
    y: line.y1 + (line.y2 - line.y1) / 2,
  };

  const stats = [edge.mainStat, edge.secondaryStat].filter((x) => x);
  const height = stats.length > 1 ? '30' : '15';
  const middleOffset = stats.length > 1 ? 15 : 7.5;
  let offset = stats.length > 1 ? -5 : 2.5;

  const contents: JSX.Element[] = [];
  stats.forEach((stat, index) => {
    contents.push(
      <text key={index} {...stylex.props(edgeLabelStyles.text)} x={middle.x} y={middle.y + offset} textAnchor={'middle'}>
        {stat}
      </text>
    );
    offset += 15;
  });

  return (
    <g {...stylex.props(edgeLabelStyles.mainGroup)}>
      <rect
        {...stylex.props(edgeLabelStyles.background)}
        x={middle.x - 40}
        y={middle.y - middleOffset}
        width="80"
        height={height}
        rx="5"
      />
      {contents}
    </g>
  );
});
