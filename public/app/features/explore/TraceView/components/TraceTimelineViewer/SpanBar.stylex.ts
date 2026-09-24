import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const spanBarStyles = stylex.create({
  wrapper: {
    label: 'wrapper',
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          overflow: 'hidden',
          zIndex: 0,
  },
  bar: {
    label: 'bar',
          borderRadius: grafanaTokens.shape_radius_sm,
          minWidth: '2px',
          position: 'absolute',
          height: '40%',
          top: '30%',
  },
  rpc: {
    label: 'rpc',
          position: 'absolute',
          top: '35%',
          bottom: '35%',
          zIndex: 1,
  },
  label: {
    label: 'label',
          color: '#aaa',
          fontSize: '12px',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans - serif",
          lineHeight: '1em',
          whiteSpace: 'nowrap',
          padding: '0 0.5em',
          position: 'absolute',
  },
  logMarker: {
    label: 'logMarker',
          backgroundColor: autoColor(theme, '#2c3235'),
          cursor: 'pointer',
          height: '60%',
          minWidth: '1px',
          position: 'absolute',
          top: '20%',
          ':hover': {
            backgroundColor: autoColor(theme, '#464c54'),
          },
          '&::before, &::after': {
            content: "''",
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            border: '1px solid transparent',
          },
          '::after': {
            left: 0,
          },
  },
  criticalPath: {
    position: 'absolute',
          top: '44%',
          height: '11%',
          zIndex: 2,
          overflow: 'hidden',
          background: autoColor(theme, '#f1f1f1'),
          borderLeft: `1px solid ${autoColor(theme, '#2c3235')}`,
          borderRight: `1px solid ${autoColor(theme, '#2c3235')}`,
  },
});
