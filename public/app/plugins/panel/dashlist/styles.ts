import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';

import { type GrafanaTheme2, colorManipulator } from '@grafana/data';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { dashlistCardMarker, dashlistLinkMarker } from './markers.stylex';

/** Sets the card hover gradient that `DashListItem`'s card applies; it's colour math on the theme. */
export function getCardHoverGradientStyle(theme: GrafanaTheme2): CSSProperties {
  const gradient = `linear-gradient(
    90deg,
    ${colorManipulator.alpha(theme.colors.primary.text, 0.1)} 0%,
    ${colorManipulator.alpha(theme.colors.secondary.main, 0.1)} 100%
  )`;
  const style: CSSProperties & Record<'--dashlist-card-hover-gradient', string> = {
    '--dashlist-card-hover-gradient': gradient,
  };
  return style;
}

export const styles = stylex.create({
  dashlistLink: {
    display: 'flex',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    margin: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x1'],
    alignItems: 'center',
  },
  dashlistLinkAnchor: {
    flex: '1',
  },
  dashlistCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    height: '100%',
    width: '100%',
  },
  dashlistCardIcon: {
    marginRight: spacing['--gf-spacing-x0-25'],
    marginTop: spacing['--gf-spacing-x0-25'],
  },
  dashlistCardLink: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: {
      default: 2,
      [bp.lgDown]: 1,
    },
    overflow: 'hidden',
    color: {
      default: null,
      [stylex.when.ancestor(':hover', dashlistCardMarker)]: colors['--gf-colors-text-link'],
    },
    textDecoration: {
      default: null,
      [stylex.when.ancestor(':hover', dashlistCardMarker)]: 'underline',
    },
  },
  dashlistCardFolder: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    overflow: 'hidden',
    whiteSpace: 'normal',
  },
  dashlistLinkName: {
    color: { default: null, [stylex.when.ancestor(':hover', dashlistLinkMarker)]: colors['--gf-colors-text-link'] },
    textDecoration: { default: null, [stylex.when.ancestor(':hover', dashlistLinkMarker)]: 'underline' },
  },
  // Not clickable or a link itself, so Card has no :hover background to keep. The hover gradient is theme colour
  // math, set on the card as a custom property.
  cardContainer: {
    display: 'block',
    height: '100%',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    backgroundImage: {
      default: null,
      [stylex.when.descendant(':hover', dashlistCardMarker)]: 'var(--dashlist-card-hover-gradient)',
    },
    color: {
      default: null,
      [stylex.when.descendant(':hover', dashlistCardMarker)]: colors['--gf-colors-text-primary'],
    },
  },
});
