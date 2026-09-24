import * as stylex from '@stylexjs/stylex';
import { CSSTransition } from 'react-transition-group';

import { easings, motion, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { CONTENT_SIDE_BAR } from '../../constants';
import { CardEditorRenderer } from '../CardEditorRenderer';
import { useQueryEditorUIContext } from '../QueryEditorContext';

import { QueryEditorDetailsSidebar } from './QueryEditorDetailsSidebar';

import './QueryEditorBody.global.css';

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

// Phase classes are styled in QueryEditorBody.global.css.
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
  },
});
