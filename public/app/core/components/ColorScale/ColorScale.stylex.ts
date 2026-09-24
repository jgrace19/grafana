import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const colorScaleStyles = stylex.create({
  scaleWrapper: {
    width: '100%',
        fontSize: '11px',
        opacity: 1,
  },
  scaleGradient: {
    background: `linear-gradient(90deg, ${colors.join()
  },
  legendValues: {
    display: 'flex',
        justifyContent: 'space-between',
        pointerEvents: 'none',
  },
  hoverValue: {
    position: 'absolute',
        marginTop: '-14px',
        padding: '3px 15px',
        transform: 'translateX(-50%)',
  },
  followerContainer: {
    position: 'relative',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
  },
  follower: {
    position: 'absolute',
        height: '13px',
        width: '13px',
        borderRadius: grafanaTokens.shape_radius_default,
        transform: 'translateX(-50%) translateY(-50%)',
        border: `2px solid ${grafanaTokens.colors_text_primary}`,
        top: '5px',
  },
  disabled: {
    color: grafanaTokens.colors_text_disabled,
  },
});
