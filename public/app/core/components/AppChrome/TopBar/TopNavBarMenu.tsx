import * as stylex from '@stylexjs/stylex';
import { cloneDeep } from 'lodash';

import { type NavModelItem } from '@grafana/data';
import { Menu, MenuItem } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { enrichWithInteractionTracking } from '../MegaMenu/utils';

export interface TopNavBarMenuProps {
  node: NavModelItem;
  children?: React.ReactNode;
}

export function TopNavBarMenu({ node: nodePlain, children }: TopNavBarMenuProps) {
  const node = enrichWithInteractionTracking(cloneDeep(nodePlain), false);

  if (!node) {
    return null;
  }

  return (
    <Menu
      header={
        // this is needed to prevent bubbling the event to `Menu` and then closing when highlighting header text
        // see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md#case-the-event-handler-is-only-being-used-to-capture-bubbled-events
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={(e) => e.stopPropagation()} {...stylex.props(styles.header)}>
          <div>{node.text}</div>
          {node.subTitle && <div {...stylex.props(styles.subTitle)}>{node.subTitle}</div>}
        </div>
      }
    >
      {node.children?.map((item) => {
        return item.url ? (
          <MenuItem url={item.url} label={item.text} icon={item.icon} target={item.target} key={item.id} />
        ) : (
          <MenuItem icon={item.icon} onClick={item.onClick} label={item.text} key={item.id} />
        );
      })}
      {children}
    </Menu>
  );
}

const styles = stylex.create({
  header: {
    fontSize: typography['--gf-typography-h5-font-size'],
    fontWeight: typography['--gf-typography-h5-font-weight'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    whiteSpace: 'nowrap',
  },

  subTitle: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
