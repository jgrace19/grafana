import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, forwardRef } from 'react';
import { useAsync } from 'react-use';

import { type ScopedVars } from '@grafana/data';
import { sanitize, sanitizeUrl } from '@grafana/data/internal';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type DashboardLink } from '@grafana/schema';
import { Dropdown, Icon, LinkButton, Button, Menu, ScrollContainer } from '@grafana/ui';
import { type ButtonLinkProps } from '@grafana/ui/internal';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { getGrafanaSearcher } from 'app/features/search/service/searcher';
import { type DashboardQueryResult } from 'app/features/search/service/types';

import { getLinkSrv } from '../../../panel/panellinks/link_srv';

interface Props {
  link: DashboardLink;
  linkInfo: { title: string };
  dashboardUID: string;
  scopedVars?: ScopedVars;
}

interface DashboardLinksMenuProps {
  link: DashboardLink;
  dashboardUID: string;
}

function DashboardLinksMenu({ dashboardUID, link }: DashboardLinksMenuProps) {
  const resolvedLinks = useResolvedLinks({ dashboardUID, link });

  if (!resolvedLinks || resolvedLinks.length === 0) {
    return (
      <Menu>
        <Menu.Item
          disabled
          label={t('dashboard.dashboard-links-menu.label-no-dashboards-found', 'No dashboards found')}
        />
      </Menu>
    );
  }

  return (
    <Menu>
      <div {...stylex.props(styles.dropdown)}>
        <ScrollContainer maxHeight="inherit">
          {resolvedLinks.map((resolvedLink, index) => {
            return (
              <Menu.Item
                url={resolvedLink.url}
                target={link.targetBlank ? '_blank' : undefined}
                key={`dashlinks-dropdown-item-${resolvedLink.uid}-${index}`}
                label={resolvedLink.title}
                testId={selectors.components.DashboardLinks.link}
                aria-label={t(
                  'dashboard.dashboard-links-menu.aria-label-dashboard-name',
                  '{{dashboardName}} dashboard',
                  { dashboardName: resolvedLink.title }
                )}
              />
            );
          })}
        </ScrollContainer>
      </div>
    </Menu>
  );
}

export const DashboardLinksDashboard = ({ link, linkInfo, dashboardUID }: Props) => {
  const { title } = linkInfo;
  const resolvedLinks = useResolvedLinks({ link, dashboardUID });

  if (link.asDropdown) {
    return (
      <div {...stylex.props(styles.linkContainer)}>
        <Dropdown overlay={<DashboardLinksMenu link={link} dashboardUID={dashboardUID} />}>
          <DashboardLinkButton
            data-placement="bottom"
            data-toggle="dropdown"
            aria-controls="dropdown-list"
            aria-haspopup="menu"
            fill="outline"
            variant="secondary"
            data-testid={selectors.components.DashboardLinks.dropDown}
          >
            <Icon aria-hidden name="bars" xstyle={styles.iconMargin} />
            <span>{title}</span>
          </DashboardLinkButton>
        </Dropdown>
      </div>
    );
  }

  return (
    <>
      {resolvedLinks.length > 0 &&
        resolvedLinks.map((resolvedLink, index) => {
          return (
            <div key={`dashlinks-list-item-${resolvedLink.uid}-${index}`} {...stylex.props(styles.linkContainer)}>
              <DashboardLinkButton
                icon="apps"
                variant="secondary"
                fill="outline"
                href={resolvedLink.url}
                target={link.targetBlank ? '_blank' : undefined}
                rel="noreferrer"
                data-testid={selectors.components.DashboardLinks.link}
              >
                {resolvedLink.title}
              </DashboardLinkButton>
            </div>
          );
        })}
    </>
  );
};

const useResolvedLinks = ({ link, dashboardUID }: Pick<Props, 'link' | 'dashboardUID'>): ResolvedLinkDTO[] => {
  const { tags } = link;
  const result = useAsync(() => searchForTags(tags), [tags]);
  if (!result.value) {
    return [];
  }
  return resolveLinks(dashboardUID, link, result.value.view);
};

interface ResolvedLinkDTO {
  uid: string;
  url: string;
  title: string;
}

export async function searchForTags(tags: string[]) {
  return getGrafanaSearcher().search({ limit: 100, tags, kind: ['dashboard'] });
}

export function resolveLinks(
  dashboardUID: string,
  link: DashboardLink,
  searchHits: DashboardQueryResult[],
  dependencies: { getLinkSrv: typeof getLinkSrv; sanitize: typeof sanitize; sanitizeUrl: typeof sanitizeUrl } = {
    getLinkSrv,
    sanitize,
    sanitizeUrl,
  }
): ResolvedLinkDTO[] {
  const hits: ResolvedLinkDTO[] = [];
  for (const searchHit of searchHits) {
    if (searchHit.uid === dashboardUID) {
      continue;
    }
    const uid = searchHit.uid;
    const title = dependencies.sanitize(searchHit.name);
    const resolvedLink = dependencies.getLinkSrv().getLinkUrl({ ...link, url: searchHit.url });
    const url = dependencies.sanitizeUrl(resolvedLink);
    hits.push({ uid, title, url });
  }
  return hits;
}

const styles = stylex.create({
  iconMargin: {
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  dropdown: {
    maxWidth: 'max(30vw, 300px)',
    maxHeight: '70vh',
  },
  linkContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
  },
});

// Button has no xstyle, and a StyleX class string would race its own font size and padding (conventions §3.9),
// so the override goes through its merged inline style. A caller's `style` still wins, as its class used to.
const dashButtonStyle: CSSProperties = {
  fontSize: typography['--gf-typography-body-small-font-size'],
  paddingLeft: spacing['--gf-spacing-x1'],
  paddingRight: spacing['--gf-spacing-x1'],
};

export const DashboardLinkButton = forwardRef<unknown, ButtonLinkProps>(({ style, ...otherProps }, ref) => {
  const Component = otherProps.href ? LinkButton : Button;
  return (
    <Component
      {...otherProps}
      variant="secondary"
      fill="outline"
      style={{ ...dashButtonStyle, ...style }}
      ref={ref as any}
    />
  );
});

DashboardLinkButton.displayName = 'DashboardLinkButton';
