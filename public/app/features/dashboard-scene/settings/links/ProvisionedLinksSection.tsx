import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { provisionedLinksSectionStyles } from './ProvisionedLinksSection.stylex';

import { type DashboardLink } from '@grafana/schema';
import {Icon, Stack, TagList} from '@grafana/ui';

import { ProvisionedControlsSection, SourceIcon } from '../ProvisionedControlsSection';

const LINK_COLUMNS = [
  { i18nKey: 'dashboard-scene.dashboard-link-list.type', defaultText: 'Type' },
  { i18nKey: 'dashboard-scene.dashboard-link-list.info', defaultText: 'Info' },
];

export function ProvisionedLinksSection({ links }: { links: DashboardLink[] }) {


  return (
    <ProvisionedControlsSection columns={LINK_COLUMNS}>
      {links.map((link, index) => (
        <tr key={`${link.title}-${index}`}>
          <td role="gridcell">
            <Icon name="external-link-alt" /> &nbsp; {link.type}
          </td>
          <td role="gridcell">
            <Stack>
              {link.title && <span {...stylex.props(provisionedLinksSectionStyles.titleWrapper)}>{link.title}</span>}
              {link.type === 'link' && <span {...stylex.props(provisionedLinksSectionStyles.urlWrapper)}>{link.url}</span>}
              {link.type === 'dashboards' && <TagList tags={link.tags ?? []} />}
            </Stack>
          </td>
          <td role="gridcell" {...stylex.props(provisionedLinksSectionStyles.sourceCell)}>
            <SourceIcon origin={link.origin} />
          </td>
        </tr>
      ))}
    </ProvisionedControlsSection>
  );
}

