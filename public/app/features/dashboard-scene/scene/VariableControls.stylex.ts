import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const variableControlsStyles = stylex.create({
  sectionVariables: {
    display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: themeSpacing(1),
        marginBottom: themeSpacing(1),
  },
  container: {
    display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        // No border for second element (inputs) as label and input border is shared
        ' > :nth-child(2)': {
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
        marginBottom: themeSpacing(1),
        marginRight: themeSpacing(1),
  },
  verticalContainer: {
    display: 'flex',
        flexDirection: 'column',
        padding: themeSpacing(1),
  },
  switchMenuContainer: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
        padding: themeSpacing(1),
  },
  switchControl: {
    ' > div': {
          border: 'none',
          background: 'transparent',
          paddingRight: themeSpacing(0.5),
          height: themeSpacing(2),
        },
  },
  switchLabel: {
    marginTop: 0,
        marginBottom: 0,
  },
  labelSelectable: {
    cursor: 'pointer',
  },
  label: {
    display: 'flex',
        alignItems: 'center',
  },
});
