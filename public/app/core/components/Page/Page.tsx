import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { pageStyles } from './Page.stylex';
import { useLayoutEffect } from 'react';

import { useGrafana } from 'app/core/context/GrafanaContext';

import NativeScrollbar from '../NativeScrollbar';

import { PageContents } from './PageContents';
import { PageHeader } from './PageHeader';
import { PageTabs } from './PageTabs';
import { type PageType } from './types';
import { usePageNav } from './usePageNav';
import { usePageTitle } from './usePageTitle';

export const Page: PageType = ({
  navId,
  navModel: oldNavProp,
  pageNav,
  renderTitle,
  onEditTitle,
  actions,
  subTitle,
  children,
  className,
  info,
  layout = PageLayoutType.Standard,
  onSetScrollRef,
  background,
  ...otherProps
}) => {
  const navModel = usePageNav(navId, oldNavProp);
  const { chrome } = useGrafana();

  usePageTitle(navModel, pageNav);

  const pageHeaderNav = pageNav ?? navModel?.node;

  // We use useLayoutEffect here to make sure that the chrome is updated before the page is rendered
  // This prevents flickering sectionNav when going from dashboard to settings for example
  useLayoutEffect(() => {
    if (navModel) {
      chrome.update({
        sectionNav: navModel,
        pageNav: pageNav,
        layout: layout,
      });
    }
  }, [navModel, pageNav, chrome, layout]);

  const isPrimaryBg = (background ?? getDefaultBackgroundForLayout(layout)) === 'primary';

  return (
    <div {...mergeStylexClassName(stylex.props(pageStyles.wrapper, isPrimaryBg && pageStyles.wrapperPrimary, className), undefined)} {...otherProps}>
      {layout === PageLayoutType.Standard && (
        <NativeScrollbar
          // This id is used by the image renderer to scroll through the dashboard
          divId="page-scrollbar"
          onSetScrollRef={onSetScrollRef}
        >
          <div {...stylex.props(pageStyles.pageInner)}>
            {pageHeaderNav && (
              <PageHeader
                actions={actions}
                onEditTitle={onEditTitle}
                navItem={pageHeaderNav}
                renderTitle={renderTitle}
                info={info}
                subTitle={subTitle}
              />
            )}
            {pageNav && pageNav.children && <PageTabs navItem={pageNav} />}
            <div {...stylex.props(pageStyles.pageContent)}>{children}</div>
          </div>
        </NativeScrollbar>
      )}

      {layout === PageLayoutType.Canvas && (
        <NativeScrollbar
          // This id is used by the image renderer to scroll through the dashboard
          divId="page-scrollbar"
          onSetScrollRef={onSetScrollRef}
        >
          <div {...stylex.props(pageStyles.canvasContent)}>{children}</div>
        </NativeScrollbar>
      )}

      {layout === PageLayoutType.Custom && children}
    </div>
  );
};

Page.Contents = PageContents;


function getDefaultBackgroundForLayout(layout: PageLayoutType) {
  return layout === PageLayoutType.Standard ? 'primary' : 'canvas';
}
