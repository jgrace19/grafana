import * as stylex from '@stylexjs/stylex';
import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { Icon, useTheme2, Text } from '@grafana/ui';
import { inputBorderStyles, inputInvalidBorderStyles, inputStyles } from '@grafana/ui/internal';
import { mixins } from '@grafana/ui/stylex/mixins';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { FolderPickerSkeleton } from './Skeleton';

interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  handleClearSelection?: (event: React.MouseEvent<SVGElement> | React.KeyboardEvent<SVGElement>) => void;
  invalid?: boolean;
  label?: ReactNode;
}

function Trigger(
  { handleClearSelection, isLoading, invalid, label, ...rest }: TriggerProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const theme = useTheme2();
  const colorMode = theme.isDark ? 'dark' : 'light';

  const handleKeyDown = (event: React.KeyboardEvent<SVGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClearSelection?.(event);
    }
  };

  if (isLoading) {
    return <FolderPickerSkeleton />;
  }

  return (
    <div {...stylex.props(inputStyles.wrapper)}>
      <div {...stylex.props(inputStyles.inputWrapper)}>
        {label ? (
          <div {...stylex.props(inputStyles.prefixSuffix, inputStyles.prefix, styles.prefix)}>
            <Icon name="folder" />
          </div>
        ) : undefined}

        <button
          type="button"
          {...stylex.props(
            inputStyles.input,
            invalid ? inputInvalidBorderStyles[colorMode] : inputBorderStyles[colorMode],
            styles.fakeInput,
            label ? styles.hasPrefix : undefined
          )}
          {...rest}
          ref={ref}
        >
          {label ? (
            <Text truncate>{label}</Text>
          ) : (
            <Text truncate color="secondary">
              <Trans i18nKey="browse-dashboards.folder-picker.button-label">Select folder</Trans>
            </Text>
          )}

          {!isLoading && handleClearSelection && (
            <Icon
              role="button"
              tabIndex={0}
              aria-label={t('browse-dashboards.folder-picker.clear-selection', 'Clear selection')}
              xstyle={[mixins.focusRing, mixins.mouseFocusNone, styles.clearIcon]}
              name="times"
              onClick={handleClearSelection}
              onKeyDown={handleKeyDown}
            />
          )}
        </button>

        <div {...stylex.props(inputStyles.prefixSuffix, inputStyles.suffix, styles.suffix)}>
          <Icon name="angle-down" />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Trigger);

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

// Input's look on a button. The focus ring only shows when tabbing through, not when clicking the button (and not
// when focus is restored after the command palette closes).
const styles = stylex.create({
  prefix: {
    pointerEvents: 'none',
    color: colors['--gf-colors-text-primary'],
  },
  suffix: {
    pointerEvents: 'none',
  },
  fakeInput: {
    textAlign: 'left',
    letterSpacing: 'normal',
    // The Emotion styles set no cursor, so a disabled button keeps the global one.
    cursor: null,
    boxShadow: {
      default: null,
      ':focus': { default: 'unset', ':focus-visible': focusRing },
    },
    outlineStyle: { default: null, ':focus': { default: 'none', ':focus-visible': 'dotted' } },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineColor: { default: null, ':focus-visible': 'transparent' },
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    paddingRight: 28,
  },
  hasPrefix: {
    paddingLeft: 28,
  },
  clearIcon: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    cursor: 'pointer',
  },
});
