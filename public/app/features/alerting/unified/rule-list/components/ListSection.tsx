import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { listSectionStyles } from './ListSection.stylex';
import { isEmpty } from 'lodash';
import { type PropsWithChildren, type ReactNode } from 'react';
import { useToggle } from 'react-use';

import { t } from '@grafana/i18n';
import { IconButton, Stack } from '@grafana/ui';

import { Spacer } from '../../components/Spacer';

interface ListSectionProps extends PropsWithChildren {
  title: ReactNode;
  collapsed?: boolean;
  actions?: ReactNode;
  pagination?: ReactNode;
}

export const ListSection = ({
  children,
  title,
  collapsed = false,
  actions = null,
  pagination = null,
}: ListSectionProps) => {
  const [isCollapsed, toggleCollapsed] = useToggle(collapsed);

  return (
    <li {...stylex.props(listSectionStyles.wrapper)} role="treeitem" aria-selected="false">
      <div {...stylex.props(listSectionStyles.sectionTitle)}>
        <Stack alignItems="center">
          <Stack alignItems="center" gap={0.5}>
            <IconButton
              name={isCollapsed ? 'angle-right' : 'angle-down'}
              onClick={toggleCollapsed}
              aria-label={t('common.collapse', 'Collapse')}
            />
            {title}
          </Stack>
          {actions && (
            <>
              <Spacer />
              {actions}
            </>
          )}
        </Stack>
      </div>
      {!isEmpty(children) && !isCollapsed && (
        <>
          <ul role="group" {...stylex.props(listSectionStyles.groupItemsWrapper)}>
            {children}
          </ul>
          {pagination}
        </>
      )}
    </li>
  );
};

