import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { memo, Children, type ReactNode } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { bp } from '../../themes/stylex/constants.stylex';
import { mixins } from '../../themes/stylex/mixins';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Link } from '../Link/Link';
import { ToolbarButtonRow } from '../ToolbarButton/ToolbarButtonRow';

export interface Props {
  pageIcon?: IconName;
  title?: string;
  section?: string;
  parent?: string;
  onGoBack?: () => void;
  titleHref?: string;
  parentHref?: string;
  leftItems?: ReactNode[];
  children?: ReactNode;
  className?: string;
  isFullscreen?: boolean;
  'aria-label'?: string;
  buttonOverflowAlignment?: 'left' | 'right';
  /**
   * Forces left items to be visible on small screens.
   * By default left items are hidden on small screens.
   */
  forceShowLeftItems?: boolean;
  'data-testid'?: string;
}

/**
 * @deprecated Use Page instead
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/navigation-deprecated-pagetoolbar--docs
 */
export const PageToolbar = memo(
  ({
    title,
    section,
    parent,
    pageIcon,
    onGoBack,
    children,
    titleHref,
    parentHref,
    leftItems,
    isFullscreen,
    className,
    /** main nav-container aria-label **/
    'aria-label': ariaLabel,
    buttonOverflowAlignment = 'right',
    forceShowLeftItems = false,
    'data-testid': testId,
  }: Props) => {
    /**
     * .page-toolbar css class is used for some legacy css view modes (TV/Kiosk) and
     * media queries for mobile view when toolbar needs left padding to make room
     * for mobile menu icon. This logic hopefully can be changed when we move to a full react
     * app and change how the app side menu & mobile menu is rendered.
     */
    const mainStyle = clsx(
      'page-toolbar',
      stylex.props(styles.toolbar, !pageIcon && styles.noPageIcon).className,
      isFullscreen && 'page-toolbar--fullscreen',
      className
    );

    const titleEl = (
      <>
        <span {...stylex.props(styles.truncateText)}>{title}</span>
        {section && (
          <span {...stylex.props(styles.pre)}>
            {' / '}
            {section}
          </span>
        )}
      </>
    );

    const goBackLabel = t('grafana-ui.page-toolbar.go-back', 'Go back (Esc)');
    const searchParentFolderLabel = t(
      'grafana-ui.page-toolbar.search-parent-folder',
      'Search dashboard in the {{parent}} folder',
      { parent }
    );
    const searchDashboardNameLabel = t('grafana-ui.page-toolbar.search-dashboard-name', 'Search dashboard by name');
    const searchLinksLabel = t('grafana-ui.page-toolbar.search-links', 'Search links');

    return (
      <nav className={mainStyle} aria-label={ariaLabel} data-testid={testId}>
        <div {...stylex.props(styles.leftWrapper)}>
          {pageIcon && !onGoBack && (
            <div {...stylex.props(styles.pageIcon)}>
              <Icon name={pageIcon} size="lg" aria-hidden />
            </div>
          )}
          {onGoBack && (
            <div {...stylex.props(styles.pageIcon)}>
              <IconButton
                name="arrow-left"
                tooltip={goBackLabel}
                tooltipPlacement="bottom"
                size="xxl"
                data-testid={selectors.components.BackButton.backArrow}
                onClick={onGoBack}
              />
            </div>
          )}
          <nav aria-label={searchLinksLabel} {...stylex.props(styles.navElement)}>
            {parent && parentHref && (
              <>
                <Link
                  aria-label={searchParentFolderLabel}
                  {...stylex.props(mixins.focusRing, styles.titleText, styles.parentLink, styles.truncateText)}
                  href={parentHref}
                >
                  {parent} <span {...stylex.props(styles.parentIcon)}></span>
                </Link>
                {titleHref && (
                  <span {...stylex.props(styles.titleText, styles.titleDivider)} aria-hidden>
                    {'/'}
                  </span>
                )}
              </>
            )}

            {(title || Boolean(leftItems?.length)) && (
              <div {...stylex.props(styles.titleWrapper)}>
                {title && (
                  <h1 {...stylex.props(styles.h1Styles)}>
                    {titleHref ? (
                      <Link
                        aria-label={searchDashboardNameLabel}
                        {...stylex.props(mixins.focusRing, styles.titleText)}
                        href={titleHref}
                      >
                        {titleEl}
                      </Link>
                    ) : (
                      <div {...stylex.props(styles.titleText)}>{titleEl}</div>
                    )}
                  </h1>
                )}

                {leftItems?.map((child, index) => (
                  <div
                    {...stylex.props(styles.leftActionItem, forceShowLeftItems && styles.forceShowLeftActionItems)}
                    key={index}
                  >
                    {child}
                  </div>
                ))}
              </div>
            )}
          </nav>
        </div>
        <ToolbarButtonRow alignment={buttonOverflowAlignment}>
          {Children.toArray(children).filter(Boolean)}
        </ToolbarButtonRow>
      </nav>
    );
  }
);

PageToolbar.displayName = 'PageToolbar';

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  pre: {
    whiteSpace: 'pre',
  },
  toolbar: {
    alignItems: 'center',
    backgroundColor: colors['--gf-colors-background-canvas'],
    display: 'flex',
    gap: `calc(${grid} * 2)`,
    justifyContent: 'space-between',
    paddingTop: `calc(${grid} * 2)`,
    paddingRight: `calc(${grid} * 2)`,
    paddingBottom: `calc(${grid} * 2)`,
    paddingLeft: { default: `calc(${grid} * 2)`, [bp.mdDown]: '53px' },
  },
  noPageIcon: {
    paddingLeft: `calc(${grid} * 2)`,
  },
  leftWrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    maxWidth: '70%',
  },
  pageIcon: {
    display: { default: 'none', [bp.smUp]: 'flex' },
    paddingRight: { default: null, [bp.smUp]: grid },
    alignItems: { default: null, [bp.smUp]: 'center' },
  },
  truncateText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleWrapper: {
    display: 'flex',
    margin: 0,
    minWidth: 0,
  },
  navElement: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
  },
  h1Styles: {
    marginTop: 0,
    marginRight: grid,
    marginBottom: 0,
    marginLeft: 0,
    lineHeight: 'inherit',
    flexGrow: 1,
    minWidth: 0,
  },
  parentIcon: {
    marginLeft: `calc(${grid} * 0.5)`,
  },
  titleText: {
    display: 'flex',
    fontSize: typography['--gf-typography-size-lg'],
    margin: 0,
    borderRadius: shape['--gf-shape-radius-default'],
  },
  titleDivider: {
    paddingTop: 0,
    paddingRight: `calc(${grid} * 0.5)`,
    paddingBottom: 0,
    paddingLeft: `calc(${grid} * 0.5)`,
    display: { default: 'none', [bp.mdUp]: 'unset' },
  },
  parentLink: {
    display: { default: 'none', [bp.mdUp]: 'unset' },
    flex: { default: null, [bp.mdUp]: '1' },
  },
  leftActionItem: {
    display: { default: 'none', [bp.mdUp]: 'flex' },
    alignItems: 'center',
    paddingRight: `calc(${grid} * 0.5)`,
  },
  forceShowLeftActionItems: {
    display: 'flex',
  },
});
