import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect } from 'react';

import { PageLayoutType } from '@grafana/data';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
  style,
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
    <div
      {...mergeStylexProps(stylex.props(styles.wrapper, isPrimaryBg && styles.wrapperPrimary), { className, style })}
      {...otherProps}
    >
      {layout === PageLayoutType.Standard && (
        <NativeScrollbar
          // This id is used by the image renderer to scroll through the dashboard
          divId="page-scrollbar"
          onSetScrollRef={onSetScrollRef}
        >
          <div {...stylex.props(styles.pageInner)}>
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
            <div {...stylex.props(styles.pageContent)}>{children}</div>
          </div>
        </NativeScrollbar>
      )}

      {layout === PageLayoutType.Canvas && (
        <NativeScrollbar
          // This id is used by the image renderer to scroll through the dashboard
          divId="page-scrollbar"
          onSetScrollRef={onSetScrollRef}
        >
          <div {...stylex.props(styles.canvasContent)}>{children}</div>
        </NativeScrollbar>
      )}

      {layout === PageLayoutType.Custom && children}
    </div>
  );
};

Page.Contents = PageContents;

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    position: 'relative',
    containerName: 'page',
    containerType: 'inline-size',
  },
  wrapperPrimary: {
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  pageContent: {
    flexGrow: 1,
  },
  pageInner: {
    paddingTop: { default: spacing['--gf-spacing-x2'], [bp.mdUp]: spacing['--gf-spacing-x4'] },
    paddingRight: { default: spacing['--gf-spacing-x2'], [bp.mdUp]: spacing['--gf-spacing-x4'] },
    paddingBottom: { default: spacing['--gf-spacing-x2'], [bp.mdUp]: spacing['--gf-spacing-x4'] },
    paddingLeft: { default: spacing['--gf-spacing-x2'], [bp.mdUp]: spacing['--gf-spacing-x4'] },
    borderBottomStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginTop: spacing['--gf-spacing-x0'],
    marginRight: spacing['--gf-spacing-x0'],
    marginBottom: spacing['--gf-spacing-x0'],
    marginLeft: spacing['--gf-spacing-x0'],
  },
  canvasContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    flexBasis: '100%',
    flexGrow: 1,
  },
});

function getDefaultBackgroundForLayout(layout: PageLayoutType) {
  return layout === PageLayoutType.Standard ? 'primary' : 'canvas';
}
