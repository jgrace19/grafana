import * as stylex from '@stylexjs/stylex';
import { useKBar, VisualState } from 'kbar';
import React, { useMemo } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Icon, Text, ToolbarButton, useTheme2 } from '@grafana/ui';
import { inputBorderStyles, inputStyles } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useMediaQueryMinWidth } from 'app/core/hooks/useMediaQueryMinWidth';
import { getModKey } from 'app/core/utils/browser';

import { NavToolbarSeparator } from '../NavToolbar/NavToolbarSeparator';

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
  const modKey = useMemo(() => getModKey(), []);

  // We want the desktop command palette trigger to look like a search box,
  // but it actually behaves like a button - you active it and it performs an
  // action. You don't actually type into it.

  return (
    <div
      {...stylex.props(inputStyles.wrapper, styles.wrapper)}
      data-testid={selectors.components.NavToolbar.commandPaletteTrigger}
    >
      <div {...stylex.props(inputStyles.inputWrapper)}>
        <div {...stylex.props(inputStyles.prefixSuffix, inputStyles.prefix)}>
          <Icon name="search" />
        </div>

        <button
          {...stylex.props(inputStyles.input, inputBorderStyles[theme.isDark ? 'dark' : 'light'], styles.fakeInput)}
          onClick={onClick}
        >
          {t('nav.search.placeholderCommandPalette', 'Search...')}
        </button>

        <div {...stylex.props(inputStyles.prefixSuffix, inputStyles.suffix, styles.suffix)}>
          <Text variant="bodySmall">{`${modKey}+k`}</Text>
        </div>
      </div>
    </div>
  );
}

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// Input's look on a button. The focus ring only shows when tabbing through, not when clicking the button (and not
// when focus is restored after the command palette closes).
const styles = stylex.create({
  wrapper: {
    width: 'auto',
    minWidth: 140,
    maxWidth: 350,
    flexGrow: 1,
  },
  suffix: {
    display: 'flex',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
  fakeInput: {
    textAlign: 'left',
    paddingLeft: 28,
    color: colors['--gf-colors-text-disabled'],
    boxShadow: {
      default: null,
      ':focus': { default: 'unset', ':focus-visible': focusRing },
    },
    outlineStyle: { default: null, ':focus': { default: 'none', ':focus-visible': 'dotted' } },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineColor: { default: null, ':focus-visible': 'transparent' },
  },
});
