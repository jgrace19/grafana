import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { Trans, t } from '@grafana/i18n';
import { Button, ScrollContainer, Stack } from '@grafana/ui';
import { colors, components, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { isNotDelegatable } from 'app/core/utils/roles';
import { type Role } from 'app/types/accessControl';

import { RoleMenuOption } from './RoleMenuOption';
import { MENU_MAX_HEIGHT } from './constants';
import { optionStyles } from './styles';

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
  const onClearInternal = async () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div
      {...stylex.props(styles.subMenu, showOnLeft && styles.subMenuLeft)}
      aria-label={t('role-picker.sub-menu-aria-label', 'Role picker submenu')}
    >
      <ScrollContainer maxHeight={`${MENU_MAX_HEIGHT}px`} paddingTop={1}>
        <div {...stylex.props(optionStyles.optionBody)}>
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
      <div {...stylex.props(styles.subMenuButtonRow)}>
        <Stack justifyContent="flex-end">
          <Button size="sm" fill="text" onClick={onClearInternal}>
            <Trans i18nKey="role-picker.sub-menu.clear-button">Clear</Trans>
          </Button>
        </Stack>
      </div>
    </div>
  );
};

// ROLE_PICKER_SUBMENU_MIN_WIDTH / ROLE_PICKER_SUBMENU_MAX_WIDTH: stylex.create can't read imported values.
const styles = stylex.create({
  subMenu: {
    height: '100%',
    minWidth: '320px',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: components['--gf-components-input-border-color'],
  },
  subMenuLeft: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: components['--gf-components-input-border-color'],
    borderLeftWidth: 'unset',
    borderLeftStyle: 'unset',
    borderLeftColor: 'unset',
  },
  subMenuButtonRow: {
    backgroundColor: colors['--gf-colors-background-primary'],
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
});
