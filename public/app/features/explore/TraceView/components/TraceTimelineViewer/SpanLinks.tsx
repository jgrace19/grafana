import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { spanLinksStyles } from './SpanLinks.stylex';
import { useState } from 'react';

import { config, reportInteraction } from '@grafana/runtime';
import { MenuItem, Icon, ContextMenu, useTheme2  } from '@grafana/ui';

import { type SpanLinkDef } from '../types/links';

interface SpanLinksProps {
  links: SpanLinkDef[];
  datasourceType: string;
  color: string;
}

const renderMenuItems = (
  links: SpanLinkDef[],
  styles: ReturnType<typeof getStyles>,
  closeMenu: () => void,
  datasourceType: string
) => {
  links.sort((linkA, linkB) => {
    // eslint-disable-next-line @grafana/no-locale-compare
    return (linkA.title || 'link').toLowerCase().localeCompare((linkB.title || 'link').toLowerCase());
  });

  return links.map((link, i) => (
    <MenuItem
      key={i}
      label={link.title || 'Link'}
      onClick={
        link.onClick
          ? (event) => {
              reportInteraction(`grafana_traces_trace_view_span_link_clicked`, {
                datasourceType: datasourceType,
                grafana_version: config.buildInfo.version,
                type: link.type,
                location: 'menu',
              });
              event?.preventDefault();
              link.onClick!(event);
              closeMenu();
            }
          : undefined
      }
      url={link.href}
      target={link.target}
      {...stylex.props(spanLinksStyles.menuItem)}
    />
  ));
};

export const SpanLinksMenu = ({ links, datasourceType, color }: SpanLinksProps) => {
  const theme = useTheme2();
  const styles = useStyles2(() => getStyles(theme, color));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div data-testid="SpanLinksMenu" {...stylex.props(spanLinksStyles.wrapper)}>
      <button
        onClick={(e) => {
          setIsMenuOpen(true);
          setMenuPosition({
            x: e.clientX,
            y: e.clientY,
          });
        }}
        {...stylex.props(spanLinksStyles.button)}
      >
        <Icon name="link" {...stylex.props(spanLinksStyles.icon)} />
      </button>

      {isMenuOpen ? (
        <ContextMenu
          onClose={() => setIsMenuOpen(false)}
          renderMenuItems={() => renderMenuItems(links, styles, closeMenu, datasourceType)}
          focusOnOpen={false}
          x={menuPosition.x}
          y={menuPosition.y}
        />
      ) : null}
    </div>
  );
};

