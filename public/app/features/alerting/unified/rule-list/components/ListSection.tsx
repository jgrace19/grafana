import * as stylex from '@stylexjs/stylex';
import { isEmpty } from 'lodash';
import { type PropsWithChildren, type ReactNode } from 'react';
import { useToggle } from 'react-use';

import { t } from '@grafana/i18n';
import { IconButton, Stack } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { Spacer } from '../../components/Spacer';

import './ListSection.css';

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
    <li {...stylex.props(styles.wrapper)} role="treeitem" aria-selected="false">
      <div {...stylex.props(styles.sectionTitle)}>
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
          <ul
            role="group"
            {...mergeStylexProps(stylex.props(styles.groupItemsWrapper), { className: 'gf-list-section-items' })}
          >
            {children}
          </ul>
          {pagination}
        </>
      )}
    </li>
  );
};

const styles = stylex.create({
  // The nested list items are styled by ListSection.css.
  groupItemsWrapper: {
    position: 'relative',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
    borderRadius: { default: null, ':hover': shape['--gf-shape-radius-default'] },
  },
});
