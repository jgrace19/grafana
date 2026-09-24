import { css } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';

/** @deprecated Emotion styles for Field/Checkbox compatibility */
export const getLabelStyles = (theme: GrafanaTheme2) => ({
  label: css({
    label: 'Label',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.25,
    marginBottom: theme.spacing(0.5),
    color: theme.colors.text.primary,
    maxWidth: '480px',
  }),
  labelContent: css({
    display: 'flex',
    alignItems: 'center',
  }),
  description: css({
    label: 'Label-description',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: theme.spacing(0.25),
    display: 'block',
  }),
  categories: css({
    label: 'Label-categories',
    display: 'inline-flex',
    alignItems: 'center',
  }),
  chevron: css({
    margin: theme.spacing(0, 0.25),
  }),
});
