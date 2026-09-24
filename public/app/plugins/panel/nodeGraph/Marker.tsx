import * as stylex from '@stylexjs/stylex';
import { markerStyles } from './Marker.stylex';

import { type MouseEvent, memo } from 'react';

import { t } from '@grafana/i18n';

import { type NodesMarker } from './types';

const nodeR = 40;


export const Marker = memo(function Marker(props: {
  marker: NodesMarker;
  onClick?: (event: MouseEvent<SVGElement>, marker: NodesMarker) => void;
}) {
  const { marker, onClick } = props;
  const { node } = marker;

  if (!(node.x !== undefined && node.y !== undefined)) {
    return null;
  }

  return (
    <g
      data-node-id={node.id}
      {...stylex.props(markerStyles.mainGroup)}
      onClick={(event) => {
        onClick?.(event, marker);
      }}
      aria-label={t('nodeGraph.marker.aria-label-hidden-marker', 'Hidden nodes marker: {{marker}}', {
        marker: node.id,
      })}
    >
      <circle {...stylex.props(markerStyles.mainCircle)} r={nodeR} cx={node.x} cy={node.y} />
      <g>
        <foreignObject x={node.x - 25} y={node.y - 25} width="50" height="50">
          <div {...stylex.props(markerStyles.text)}>
            {/* we limit the count to 101 so if we have more than 100 nodes we don't have exact count */}
            <span>
              {marker.count > 100
                ? t('nodeGraph.marker.100-node-count', '>100 nodes')
                : t('nodeGraph.marker.node-count', '{{count}} nodes', { count: marker.count })}
            </span>
          </div>
        </foreignObject>
      </g>
    </g>
  );
});
