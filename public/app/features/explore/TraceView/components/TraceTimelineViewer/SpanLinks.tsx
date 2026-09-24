import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { config, reportInteraction } from '@grafana/runtime';
import { MenuItem, Icon, ContextMenu } from '@grafana/ui';

import { type SpanLinkDef } from '../types/links';

interface SpanLinksProps {
  links: SpanLinkDef[];
  datasourceType: string;
  color: string;
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
}

const renderMenuItems = (links: SpanLinkDef[], closeMenu: () => void, datasourceType: string) => {
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
      className={stylex.props(styles.menuItem).className}
    />
  ));
};

export const SpanLinksMenu = ({ links, datasourceType, color, xstyle }: SpanLinksProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div data-testid="SpanLinksMenu" {...stylex.props(styles.wrapper, styles.wrapperColor(`${color}CF`), xstyle)}>
      <button
        onClick={(e) => {
          setIsMenuOpen(true);
          setMenuPosition({
            x: e.clientX,
            y: e.clientY,
          });
        }}
        {...stylex.props(styles.button)}
      >
        <Icon name="link" xstyle={styles.icon} />
      </button>

      {isMenuOpen ? (
        <ContextMenu
          onClose={() => setIsMenuOpen(false)}
          renderMenuItems={() => renderMenuItems(links, closeMenu, datasourceType)}
          focusOnOpen={false}
          x={menuPosition.x}
          y={menuPosition.y}
        />
      ) : null}
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    borderStyle: 'none',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  wrapperColor: (borderColor: string) => ({
    borderBottomColor: borderColor,
  }),
  button: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    padding: 0,
  },
  icon: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    padding: 0,
  },
  menuItem: {
    maxWidth: '60ch',
    overflow: 'hidden',
  },
});
