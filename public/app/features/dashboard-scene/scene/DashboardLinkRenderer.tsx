import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardLinkRendererStyles } from './DashboardLinkRenderer.stylex';
import { useCallback, useMemo } from 'react';

import { sanitizeUrl } from '@grafana/data/internal';
import { selectors } from '@grafana/e2e-selectors';
import { type DashboardLink } from '@grafana/schema';
import {MenuItem, Tooltip, useElementSelection} from '@grafana/ui';
import {
  DashboardLinkButton,
  DashboardLinksDashboard,
} from 'app/features/dashboard/components/SubMenu/DashboardLinksDashboard';
import { getLinkSrv } from 'app/features/panel/panellinks/link_srv';

import { linkSelectionId, openLinkEditPane } from '../settings/links/LinkAddEditableElement';
import { linkEditActions } from '../settings/links/actions';
import { LINK_ICON_MAP } from '../settings/links/utils';

import { ControlActionsPopover, ControlEditActions } from './ControlActionsPopover';
import { type DashboardScene } from './DashboardScene';

export interface Props {
  link: DashboardLink;
  dashboardUID: string;
  inMenu?: boolean;
  linkIndex: number;
  dashboard: DashboardScene;
}

export function DashboardLinkRenderer({ link, dashboardUID, inMenu, linkIndex, dashboard }: Props) {
  const linkInfo = getLinkSrv().getAnchorInfo(link);

  const selectionId = linkIndex != null && linkIndex >= 0 ? linkSelectionId(linkIndex) : undefined;
  const { isSelected, isSelectable } = useElementSelection(selectionId);

  const onClickEditLink = useCallback(() => {
    openLinkEditPane(dashboard, Number(linkIndex));
  }, [dashboard, linkIndex]);

  const onClickDeleteLink = useCallback(() => {
    linkEditActions.removeLink({ dashboard, linkIndex });
  }, [dashboard, linkIndex]);

  const editActions = useMemo(
    () => <ControlEditActions onClickEdit={onClickEditLink} onClickDelete={onClickDeleteLink} />,
    [onClickEditLink, onClickDeleteLink]
  );

  let content: React.ReactNode;
  if (link.type === 'dashboards') {
    content = <DashboardLinksDashboard link={link} linkInfo={linkInfo} dashboardUID={dashboardUID} />;
  } else {
    const icon = LINK_ICON_MAP[link.icon];
    const linkElement = inMenu ? (
      <MenuItem
        icon={icon}
        url={sanitizeUrl(linkInfo.href)}
        label={linkInfo.title}
        target={link.targetBlank ? '_blank' : undefined}
        data-testid={selectors.components.DashboardLinks.link}
      />
    ) : (
      <DashboardLinkButton
        icon={icon}
        href={sanitizeUrl(linkInfo.href)}
        target={link.targetBlank ? '_blank' : undefined}
        rel="noreferrer"
        data-testid={selectors.components.DashboardLinks.link}
      >
        {linkInfo.title}
      </DashboardLinkButton>
    );
    content = link.tooltip ? <Tooltip content={linkInfo.tooltip}>{linkElement}</Tooltip> : linkElement;
  }

  const containerClassName = cx(
    dashboardLinkRendererStyles.linkContainer,
    isSelected && 'dashboard-selected-element',
    isSelectable && !isSelected && 'dashboard-selectable-element'
  );

  return (
    <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
      <div className={containerClassName} data-testid={selectors.components.DashboardLinks.container}>
        {content}
      </div>
    </ControlActionsPopover>
  );
}


