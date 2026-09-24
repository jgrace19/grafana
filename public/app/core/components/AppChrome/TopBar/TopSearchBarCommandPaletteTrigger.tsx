import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { useKBar, VisualState } from 'kbar';
import React, { useMemo } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { getInputStyles, Icon, Text, ToolbarButton, useTheme2 } from '@grafana/ui';
import { getFocusStyles } from '@grafana/ui/internal';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { useMediaQueryMinWidth } from 'app/core/hooks/useMediaQueryMinWidth';
import { getModKey } from 'app/core/utils/browser';

import { NavToolbarSeparator } from '../NavToolbar/NavToolbarSeparator';

import { topSearchBarCommandPaletteTriggerStyles } from './TopSearchBarCommandPaletteTrigger.stylex';

export const TopSearchBarCommandPaletteTrigger = React.memo(() => {
  const { query: kbar } = useKBar((kbarState) => ({
    kbarSearchQuery: kbarState.searchQuery,
    kbarIsOpen: kbarState.visualState === VisualState.showing,
  }));

  const isLargeScreen = useMediaQueryMinWidth('lg');

  const onOpenSearch = () => {
    kbar.toggle();
  };

  if (!isLargeScreen) {
    return (
      <>
        <ToolbarButton
          iconOnly
          icon="search"
          aria-label={t('nav.search.placeholderCommandPalette', 'Search...')}
          onClick={onOpenSearch}
        />
        <NavToolbarSeparator />
      </>
    );
  }

  return <PretendTextInput onClick={onOpenSearch} />;
});
TopSearchBarCommandPaletteTrigger.displayName = 'TopSearchBarCommandPaletteTrigger';

interface PretendTextInputProps {
  onClick: () => void;
}

function PretendTextInput({ onClick }: PretendTextInputProps) {
  const theme = useTheme2();
  const baseStyles = getInputStyles({ theme });
  const modKey = useMemo(() => getModKey(), []);

  const focusVisibleClass = getFocusStyles(theme);

  return (
    <div
      {...mergeStylexClassName(
        stylex.props(topSearchBarCommandPaletteTriggerStyles.inputExtras),
        clsx(baseStyles.wrapper)
      )}
      data-testid={selectors.components.NavToolbar.commandPaletteTrigger}
    >
      <div className={baseStyles.inputWrapper}>
        <div className={baseStyles.prefix}>
          <Icon name="search" />
        </div>

        <button
          {...mergeStylexClassName(
            stylex.props(topSearchBarCommandPaletteTriggerStyles.fakeInput),
            clsx(baseStyles.input, focusVisibleClass)
          )}
          onClick={onClick}
        >
          {t('nav.search.placeholderCommandPalette', 'Search...')}
        </button>

        <div
          {...mergeStylexClassName(
            stylex.props(topSearchBarCommandPaletteTriggerStyles.suffix),
            baseStyles.suffix
          )}
        >
          <Text variant="bodySmall">{`${modKey}+k`}</Text>
        </div>
      </div>
    </div>
  );
}
