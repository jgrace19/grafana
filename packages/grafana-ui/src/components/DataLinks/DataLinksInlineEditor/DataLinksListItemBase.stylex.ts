import * as stylex from '@stylexjs/stylex';

import { cssVar, cssVarSpacing } from '../../../themes/stylex/cssVar';

export const dataLinksListItemBaseStyles = stylex.create({
  wrapper: {
    display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 0 5px 10px',
          borderRadius: cssVar('shape.radius.default'),
          background: cssVar('colors.background.secondary'),
          gap: 8,
  },
  linkDetails: {
    display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          maxWidth: `calc(100% - 100px)`,
  },
  errored: {
    color: cssVar('colors.error.text'),
          fontStyle: 'italic',
  },
  notConfigured: {
    fontStyle: 'italic',
  },
  title: {
    color: cssVar('colors.text.primary'),
          fontSize: cssVar('typography.size.sm'),
          fontWeight: cssVar('typography.fontWeightMedium'),
  },
  url: {
    color: cssVar('colors.text.secondary'),
          fontSize: cssVar('typography.size.sm'),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
  },
  dragRow: {
    position: 'relative',
          margin: '8px',
  },
  icons: {
    display: 'flex',
          padding: 6,
          alignItems: 'center',
          gap: 8,
  },
  dragIcon: {
    cursor: 'grab',
          color: cssVar('colors.text.secondary'),
          margin: cssVarSpacing(0, 0.5),
  },
  icon: {
    color: cssVar('colors.text.secondary'),
  },
});

export function dataLinksListItemBaseStyleProps(key: keyof typeof dataLinksListItemBaseStyles) {
  return stylex.props(dataLinksListItemBaseStyles[key]);
}
