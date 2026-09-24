import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const sidebarCollapsableHeaderStyles = stylex.create({
  collapsableSection: {
    marginTop: themeSpacing(0.5),
  },
  contentArea: {
    padding: 0,
  },
  queryStackCardsContainer: {
    paddingTop: themeSpacing(1),
  },
  headerActionWrapper: {
    // This is used so we can stop the header action from triggering the collapse of the header
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-start',
  },
  headerContent: {
    width: '100%',
  },
});
