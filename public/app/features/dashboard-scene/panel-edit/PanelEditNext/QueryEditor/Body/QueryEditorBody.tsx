import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryEditorBodyStyles } from './QueryEditorBody.stylex';
import { CSSTransition } from 'react-transition-group';
import { useMemo } from 'react';

import { useTheme2 } from '@grafana/ui';

import { CONTENT_SIDE_BAR } from '../../constants';
import { CardEditorRenderer } from '../CardEditorRenderer';
import { useQueryEditorUIContext } from '../QueryEditorContext';

import { QueryEditorDetailsSidebar } from './QueryEditorDetailsSidebar';

export function QueryEditorBody() {
  const theme = useTheme2();
  const { queryOptions } = useQueryEditorUIContext();
  const { isQueryOptionsOpen } = queryOptions;

  const sidebarTransition = useMemo(() => {
    const slideTransition = theme.transitions.create('transform', {
      duration: CONTENT_SIDE_BAR.sidebarTransitionMs,
      easing: theme.transitions.easing.easeInOut,
    });

    return {
      enter: stylex.props(queryEditorBodyStyles.enter).className ?? '',
      enterActive: mergeStylexClassName(
        stylex.props(queryEditorBodyStyles.enterActive),
        undefined
      ).className,
      exit: stylex.props(queryEditorBodyStyles.exit).className ?? '',
      exitActive: mergeStylexClassName(stylex.props(queryEditorBodyStyles.exitActive), undefined).className,
      // react-transition-group applies these as class names; transition lives on active states via global style hook
    };
  }, [theme]);

  const enterActiveStyle = useMemo(
    () => ({
      transition: theme.transitions.create('transform', {
        duration: CONTENT_SIDE_BAR.sidebarTransitionMs,
        easing: theme.transitions.easing.easeInOut,
      }),
    }),
    [theme]
  );

  return (
    <div {...stylex.props(queryEditorBodyStyles.container)}>
      <div
        {...mergeStylexClassName(
          stylex.props(
            queryEditorBodyStyles.scrollableContent,
            isQueryOptionsOpen && queryEditorBodyStyles.scrollableContentBlurred
          ),
          undefined
        )}
      >
        <CardEditorRenderer />
      </div>
      <CSSTransition
        classNames={{
          ...sidebarTransition,
          enterActive: clsx(sidebarTransition.enterActive, 'query-editor-sidebar-enter-active'),
          exitActive: clsx(sidebarTransition.exitActive, 'query-editor-sidebar-exit-active'),
        }}
        in={isQueryOptionsOpen}
        mountOnEnter
        timeout={CONTENT_SIDE_BAR.sidebarTransitionMs}
        unmountOnExit
      >
        <div {...stylex.props(queryEditorBodyStyles.sidebar)} style={enterActiveStyle}>
          <QueryEditorDetailsSidebar />
        </div>
      </CSSTransition>
    </div>
  );
}
