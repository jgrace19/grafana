import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerStyles } from './stylesStyles.stylex';
import type { JSX } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Button, ScrollContainer, Stack, useTheme2 } from '@grafana/ui';
import { getSelectStyles } from '@grafana/ui/internal';
import { isNotDelegatable } from 'app/core/utils/roles';
import { type Role } from 'app/types/accessControl';

import { RoleMenuOption } from './RoleMenuOption';
import { MENU_MAX_HEIGHT } from './constants';

interface RolePickerSubMenuProps {
  options: Role[];
  selectedOptions: Role[];
  disabledOptions?: Role[];
  onSelect: (option: Role) => void;
  onClear?: () => void;
  showOnLeft?: boolean;
}

export const RolePickerSubMenu = ({
  options,
  selectedOptions,
  disabledOptions,
  onSelect,
  onClear,
  showOnLeft,
}: RolePickerSubMenuProps): JSX.Element => {
  const theme = useTheme2();
  const styles = getSelectStyles(theme);

  const onClearInternal = async () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div
      {...mergeStylexClassName(
        stylex.props(rolePickerStyles.subMenu, showOnLeft && rolePickerStyles.subMenuLeft),
        undefined
      )}
      aria-label={t('role-picker.sub-menu-aria-label', 'Role picker submenu')}
    >
      <ScrollContainer maxHeight={`${MENU_MAX_HEIGHT}px`}>
        <div className={stylesStyles.optionBody}>
          {options.map((option, i) => (
            <RoleMenuOption
              data={option}
              useFilteredDisplayName={false}
              key={i}
              isSelected={
                !!(
                  option.uid &&
                  (!!selectedOptions.find((opt) => opt.uid === option.uid) ||
                    disabledOptions?.find((opt) => opt.uid === option.uid))
                )
              }
              disabled={
                !!(option.uid && disabledOptions?.find((opt) => opt.uid === option.uid)) || isNotDelegatable(option)
              }
              mapped={!!(option.uid && selectedOptions.find((opt) => opt.uid === option.uid && opt.mapped))}
              onChange={onSelect}
              hideDescription
            />
          ))}
        </div>
      </ScrollContainer>
      <div {...stylex.props(rolePickerStyles.subMenuButtonRow)}>
        <Stack justifyContent="flex-end">
          <Button size="sm" fill="text" onClick={onClearInternal}>
            <Trans i18nKey="role-picker.sub-menu.clear-button">Clear</Trans>
          </Button>
        </Stack>
      </div>
    </div>
  );
};
