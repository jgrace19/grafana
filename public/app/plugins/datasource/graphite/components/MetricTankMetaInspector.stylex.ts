import * as stylex from '@stylexjs/stylex';

import { config } from '@grafana/runtime';

const theme = config.theme2;
const borderColor = theme.isDark ? theme.palette.gray25 : theme.palette.gray85;
const background = theme.isDark ? theme.palette.dark1 : theme.palette.white;
const headerBg = theme.isDark ? theme.palette.gray15 : theme.palette.gray85;

export const metricTankMetaInspectorStyles = stylex.create({
  metaItem: {
    background,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor,
    marginBottom: theme.spacing.md,
  },
  metaItemHeader: {
    background: headerBg,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    fontSize: theme.typography.size.md,
    display: 'flex',
    justifyContent: 'space-between',
  },
  metaItemBody: {
    padding: theme.spacing.md,
  },
  stepHeading: {
    fontSize: theme.typography.size.md,
  },
  stepDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textWeak,
    marginBottom: theme.spacing.sm,
  },
  step: {
    marginBottom: theme.spacing.lg,
    ':last-child': {
      marginBottom: 0,
    },
  },
  bucket: {
    display: 'flex',
    marginBottom: theme.spacing.sm,
    borderRadius: theme.border.radius.sm,
  },
  bucketInterval: {
    flexGrow: 0,
    width: '60px',
  },
  bucketRetention: {
    background: `linear-gradient(0deg, ${theme.palette.blue85}, ${theme.palette.blue95})`,
    textAlign: 'center',
    color: theme.palette.white,
    marginRight: theme.spacing.md,
    borderRadius: theme.border.radius.sm,
  },
  bucketRetentionActive: {
    background: `linear-gradient(0deg, ${theme.palette.greenBase}, ${theme.palette.greenShade})`,
  },
});
