import * as stylex from '@stylexjs/stylex';

import { type DashboardLink } from '@grafana/schema';
import { Icon, Stack, TagList } from '@grafana/ui';

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
              {link.title && <span {...stylex.props(styles.titleWrapper)}>{link.title}</span>}
              {link.type === 'link' && <span {...stylex.props(styles.urlWrapper)}>{link.url}</span>}
              {link.type === 'dashboards' && <TagList tags={link.tags ?? []} />}
            </Stack>
          </td>
          <td role="gridcell" {...stylex.props(styles.sourceCell)}>
            <SourceIcon origin={link.origin} />
          </td>
        </tr>
      ))}
    </ProvisionedControlsSection>
  );
}

const styles = stylex.create({
  titleWrapper: {
    width: '20vw',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  urlWrapper: {
    width: '40vw',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  sourceCell: {
    width: '1%',
    textAlign: 'center',
  },
});
