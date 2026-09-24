import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { listGroupStyles } from './ListGroup.stylex';
import { type PropsWithChildren, type ReactNode } from 'react';
import { useToggle } from 'react-use';

import { t } from '@grafana/i18n';
import { IconButton, Stack, Text, TextLink } from '@grafana/ui';

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
    <div {...stylex.props(listGroupStyles.groupWrapper)} role="treeitem" aria-expanded={open} aria-selected="false">
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
        <div role="group" {...stylex.props(listGroupStyles.childrenWrapper)}>
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
    <div {...stylex.props(listGroupStyles.headerWrapper)}>
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

