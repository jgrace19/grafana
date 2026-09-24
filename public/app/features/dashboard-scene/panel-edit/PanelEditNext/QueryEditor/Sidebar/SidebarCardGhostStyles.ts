import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sidebarCardGhostStylesStyles } from './SidebarCardGhostStyles.stylex';


;

;

const GHOST_MOVE_DURATION_MS = 3000;
const GHOST_PULSE_DURATION_MS = 2400;
const GHOST_MOVE_DELAY_MS = -1200;
const GHOST_PULSE_DELAY_MS = -700;

function getGhostBlobColor(theme: GrafanaTheme2, amount: number): string {
  return `color-mix(in srgb, ${theme.colors.text.secondary} ${amount}%, transparent)`;
}

export interface GhostCardVisuals {
  ghostBackgroundColor: string;
  ghostBorderColor: string;
  ghostAnimations: string;
  ghostAnimationDelays: string;
  ghostBlobStrong: string;
  ghostBlobMedium: string;
  ghostBlobSoft: string;
  ghostBlobOpacity: number;
  ghostIconColor: string;
}

export function getGhostCardVisuals(theme: GrafanaTheme2): GhostCardVisuals {
  return {
    ghostBackgroundColor: `color-mix(in srgb, ${theme.colors.background.secondary} 72%, ${theme.colors.background.primary})`,
    ghostBorderColor: `color-mix(in srgb, ${theme.colors.border.medium} 85%, ${theme.colors.text.secondary})`,
    ghostAnimations: `${ghostBlobFloat} ${GHOST_MOVE_DURATION_MS}ms ease-in-out infinite, ${ghostBlobPulse} ${GHOST_PULSE_DURATION_MS}ms ease-in-out infinite`,
    ghostAnimationDelays: `${GHOST_MOVE_DELAY_MS}ms, ${GHOST_PULSE_DELAY_MS}ms`,
    ghostBlobStrong: getGhostBlobColor(theme, 34),
    ghostBlobMedium: getGhostBlobColor(theme, 24),
    ghostBlobSoft: getGhostBlobColor(theme, 17),
    ghostBlobOpacity: 0.96,
    ghostIconColor: theme.colors.text.secondary,
  };
}
