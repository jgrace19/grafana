import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';

import { getFocusStyles } from '../mixins';

/**
 * @deprecated Emotion implementation kept for plugin compatibility. Use `Card` StyleX styles instead.
 * @public
 */
export const getCardContainerStyles = (
  theme: GrafanaTheme2,
  disabled = false,
  disableHover = false,
  hasDescriptionComponent: boolean,
  isSelected?: boolean,
  isCompact?: boolean,
  noMargin = false
) => {
  const isSelectable = isSelected !== undefined;

  return {
    container: css({
      display: 'grid',
      position: 'relative',
      gridTemplate: hasDescriptionComponent
        ? `
        "Figure Heading Tags"
        "Figure Meta Tags"
        "Figure Description Tags" 1fr
        "Figure Actions Secondary" / auto 1fr auto
      `
        : `
        "Figure Heading Tags" 1fr
        "Figure Meta Tags"
        "Figure Actions Secondary" / auto 1fr auto
      `,
      gridAutoColumns: '1fr',
      gridAutoFlow: 'row',
      width: '100%',
      padding: theme.spacing(isCompact ? 1 : 2),
      background: theme.colors.background.secondary,
      borderRadius: theme.shape.radius.default,
      marginBottom: theme.spacing(noMargin ? 0 : 1),
      pointerEvents: disabled ? 'none' : 'auto',
      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
          duration: theme.transitions.duration.short,
        }),
      },

      ...(!disableHover && {
        '&:hover': {
          background: theme.colors.emphasize(theme.colors.background.secondary, 0.03),
          cursor: 'pointer',
          zIndex: 1,
        },
        '&:focus': getFocusStyles(theme),
      }),

      ...(isSelectable && {
        cursor: 'pointer',
      }),

      ...(isSelected && {
        outline: `solid 2px ${theme.colors.primary.border}`,
      }),
    }),
    oldContainer: css({
      display: 'flex',
      width: '100%',
      background: theme.colors.background.secondary,
      borderRadius: theme.shape.radius.default,
      position: 'relative',
      pointerEvents: disabled ? 'none' : 'auto',
      marginBottom: theme.spacing(noMargin ? 0 : 1),
      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
          duration: theme.transitions.duration.short,
        }),
      },

      ...(!disableHover && {
        '&:hover': {
          background: theme.colors.emphasize(theme.colors.background.secondary, 0.03),
          cursor: 'pointer',
          zIndex: 1,
        },
        '&:focus': getFocusStyles(theme),
      }),
    }),
  };
};

const getHeadingStylesEmotion = (theme: GrafanaTheme2) => ({
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

/**
 * @deprecated Emotion implementation kept for plugin compatibility.
 * @public
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
    ...getHeadingStylesEmotion(theme),
  };
};
