import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren, type ReactNode } from 'react';
import { useToggle } from 'react-use';

import { t } from '@grafana/i18n';
import { IconButton, Stack, Text, TextLink } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { Spacer } from '../../components/Spacer';

interface GroupProps extends PropsWithChildren {
  name: string;
  description?: ReactNode;
  metaRight?: ReactNode;
  actions?: ReactNode;
  isOpen?: boolean;
  href?: string;
}

export const ListGroup = ({
  name,
  description,
  isOpen = true,
  metaRight = null,
  actions = null,
  href,
  children,
}: GroupProps) => {
  const [open, toggle] = useToggle(isOpen);

  return (
    <div {...stylex.props(styles.groupWrapper)} role="treeitem" aria-expanded={open} aria-selected="false">
      <GroupHeader
        onToggle={() => toggle()}
        isOpen={open}
        description={description}
        name={name}
        metaRight={metaRight}
        actions={actions}
        href={href}
      />
      {open && (
        <div role="group" {...stylex.props(styles.childrenWrapper)}>
          {children}
        </div>
      )}
    </div>
  );
};

type GroupHeaderProps = GroupProps & {
  onToggle: () => void;
};

const GroupHeader = (props: GroupHeaderProps) => {
  const { name, description, metaRight = null, actions = null, isOpen = false, onToggle, href } = props;

  return (
    <div {...stylex.props(styles.headerWrapper)}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Stack alignItems="center" gap={0.5}>
          <IconButton
            name={isOpen ? 'angle-down' : 'angle-right'}
            onClick={onToggle}
            aria-label={t('common.collapse', 'Collapse')}
          />
          {href ? (
            <TextLink href={href} color="primary" inline={false}>
              {name}
            </TextLink>
          ) : (
            <Text truncate variant="body" element="h4">
              {name}
            </Text>
          )}
        </Stack>

        {description}
        <Spacer />
        {metaRight}
        {actions}
      </Stack>
    </div>
  );
};

const styles = stylex.create({
  groupWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',

    '::before': {
      content: "''",
      position: 'absolute',
      height: '100%',

      marginLeft: spacing['--gf-spacing-x2-5'],
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: colors['--gf-colors-border-weak'],
    },
  },
  headerWrapper: {
    padding: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x4'],
    position: 'relative',

    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
    borderRadius: { default: null, ':hover': shape['--gf-shape-radius-default'] },
  },
  childrenWrapper: {
    position: 'relative',
  },
});
