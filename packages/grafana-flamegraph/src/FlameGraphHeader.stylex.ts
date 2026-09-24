import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const flameGraphHeaderStyles = stylex.create({
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    top: 0,
    gap: grafanaTokens.spacing_x1,
    marginTop: grafanaTokens.spacing_x1,
  },
  headerNew: {
    alignItems: 'flex-start',
    position: 'relative',
  },
  stickyHeader: {
    zIndex: grafanaTokens.zIndex_navbarFixed,
    position: 'sticky',
    backgroundColor: grafanaTokens.colors_background_primary,
  },
  inputContainer: {
    flexGrow: 1,
    minWidth: '150px',
    maxWidth: '350px',
  },
  inputContainerNew: {
    flexGrow: 0,
    minWidth: '150px',
    maxWidth: '350px',
  },
  middleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: grafanaTokens.spacing_x1,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  buttonSpacing: {
    marginRight: grafanaTokens.spacing_x1,
  },
  resetButton: {
    display: 'flex',
    marginRight: grafanaTokens.spacing_x2,
  },
  resetButtonIconWrapper: {
    padding: '0 5px',
    color: grafanaTokens.colors_text_disabled,
  },
  extraElements: {
    marginLeft: grafanaTokens.spacing_x1,
  },
  paneDropdownButton: {
    minWidth: '95px',
    justifyContent: 'center',
  },
});
