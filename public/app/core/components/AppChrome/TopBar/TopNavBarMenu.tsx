import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { topNavBarMenuStyles } from './TopNavBarMenu.stylex';
import { cloneDeep } from 'lodash';

import { Menu, MenuItem } from '@grafana/ui';

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
        <div onClick={(e) => e.stopPropagation()} {...stylex.props(topNavBarMenuStyles.header)}>
          <div>{node.text}</div>
          {node.subTitle && <div {...stylex.props(topNavBarMenuStyles.subTitle)}>{node.subTitle}</div>}
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

