import * as stylex from '@stylexjs/stylex';
import { CSSTransition } from 'react-transition-group';

import { easings, motion, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { CONTENT_SIDE_BAR } from '../../constants';
import { CardEditorRenderer } from '../CardEditorRenderer';
import { useQueryEditorUIContext } from '../QueryEditorContext';

import { QueryEditorDetailsSidebar } from './QueryEditorDetailsSidebar';

export function QueryEditorBody() {
  const { queryOptions } = useQueryEditorUIContext();
  const { isQueryOptionsOpen } = queryOptions;

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.scrollableContent, isQueryOptionsOpen && styles.scrollableContentBlurred)}>
        <CardEditorRenderer />
      </div>
      <CSSTransition
        classNames={sidebarTransitionClass}
        in={isQueryOptionsOpen}
        mountOnEnter
        timeout={CONTENT_SIDE_BAR.sidebarTransitionMs}
        unmountOnExit
      >
        <div {...stylex.props(styles.sidebar)}>
          <QueryEditorDetailsSidebar />
        </div>
      </CSSTransition>
    </div>
  );
}

// CSSTransition adds `<prefix>-enter` and `<prefix>-enter-active` (then `-exit`, `-exit-active`) together, so
// `styles.sidebar` keys its transform on mutually exclusive selectors for those classes.
const sidebarTransitionClass = 'gf-query-editor-details-sidebar';

// CONTENT_SIDE_BAR.sidebarTransitionMs in ../../constants.ts
const sidebarTransitionDuration = '150ms';

const styles = stylex.create({
  container: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minHeight: 0,
    display: 'flex',
  },
  scrollableContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minWidth: 0,
    overflow: 'auto',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    transitionProperty: { default: null, [motion.noPreference]: 'filter' },
    transitionDuration: { default: null, [motion.noPreference]: sidebarTransitionDuration },
    transitionTimingFunction: { default: null, [motion.noPreference]: easings.easeInOut },
  },
  scrollableContentBlurred: {
    filter: 'blur(10px)',
    pointerEvents: 'none',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    // CONTENT_SIDE_BAR.width in ../../constants.ts
    width: 500,
    zIndex: zIndex.sidemenu,
    transform: {
      default: null,
      ':is(.gf-query-editor-details-sidebar-enter:not(.gf-query-editor-details-sidebar-enter-active))':
        'translateX(-100%)',
      ':is(.gf-query-editor-details-sidebar-enter-active)': 'translateX(0)',
      ':is(.gf-query-editor-details-sidebar-exit:not(.gf-query-editor-details-sidebar-exit-active))': 'translateX(0)',
      ':is(.gf-query-editor-details-sidebar-exit-active)': 'translateX(-100%)',
    },
    transitionProperty: {
      default: null,
      [motion.noPreference]: {
        default: null,
        ':is(.gf-query-editor-details-sidebar-enter-active, .gf-query-editor-details-sidebar-exit-active)': 'transform',
      },
    },
    transitionDuration: {
      default: null,
      [motion.noPreference]: {
        default: null,
        ':is(.gf-query-editor-details-sidebar-enter-active, .gf-query-editor-details-sidebar-exit-active)':
          sidebarTransitionDuration,
      },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreference]: {
        default: null,
        ':is(.gf-query-editor-details-sidebar-enter-active, .gf-query-editor-details-sidebar-exit-active)':
          easings.easeInOut,
      },
    },
  },
});
