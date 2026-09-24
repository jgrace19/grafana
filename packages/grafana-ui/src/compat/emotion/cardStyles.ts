import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';

import { getFocusStyles } from './mixins';

// Frozen Emotion implementation of the Card styles, kept for plugins that consume `getCardStyles`.
// Card itself renders with StyleX. Keep visually in sync with Card.tsx.

const getHeadingStyles = (theme: GrafanaTheme2) => ({
  heading: css({
    gridArea: 'Heading',
    justifySelf: 'start',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    fontSize: theme.typography.size.md,
    letterSpacing: 'inherit',
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    '& input[readonly]': {
      cursor: 'inherit',
    },
  }),
  linkHack: css({
    all: 'unset',
    '&::after': {
      position: 'absolute',
      content: '""',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: theme.shape.radius.default,
    },

    '&:focus-visible': {
      outline: 'none',
      outlineOffset: 0,
      boxShadow: 'none',

      '&::after': {
        ...getFocusStyles(theme),
        zIndex: 1,
      },
    },
  }),
});

const getTagStyles = (theme: GrafanaTheme2) => ({
  tagList: css({
    position: 'relative',
    gridArea: 'Tags',
    alignSelf: 'center',
  }),
});

const getDescriptionStyles = (theme: GrafanaTheme2) => ({
  description: css({
    width: '100%',
    gridArea: 'Description',
    margin: theme.spacing(1, 0, 0),
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.body.lineHeight,
  }),
});

const getFigureStyles = (theme: GrafanaTheme2) => ({
  media: css({
    position: 'relative',
    gridArea: 'Figure',

    marginRight: theme.spacing(2),
    width: '40px',

    '> img': {
      width: '100%',
    },

    '&:empty': {
      display: 'none',
    },
  }),
});

const getMetaStyles = (theme: GrafanaTheme2) => ({
  metadata: css({
    gridArea: 'Meta',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    margin: theme.spacing(0.5, 0, 0),
    lineHeight: theme.typography.bodySmall.lineHeight,
    overflowWrap: 'anywhere',
  }),
  metadataItem: css({
    // Needed to allow for clickable children in metadata
    zIndex: 0,
  }),
  separator: css({
    margin: `0 ${theme.spacing(1)}`,
  }),
});

const getActionStyles = (theme: GrafanaTheme2) => ({
  actions: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    gridArea: 'Actions',
    marginTop: theme.spacing(2),
  }),
  secondaryActions: css({
    alignSelf: 'center',
    color: theme.colors.text.secondary,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    gridArea: 'Secondary',
    marginTop: theme.spacing(2),
  }),
});

/**
 * @public
 * @deprecated Use `className` on respective components to modify styles
 */
export const getCardStyles = (theme: GrafanaTheme2) => {
  return {
    inner: css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexWrap: 'wrap',
    }),
    ...getHeadingStyles(theme),
    ...getMetaStyles(theme),
    ...getDescriptionStyles(theme),
    ...getFigureStyles(theme),
    ...getActionStyles(theme),
    ...getTagStyles(theme),
  };
};
