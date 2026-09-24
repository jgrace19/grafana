import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { triggerStyles } from './Trigger.stylex';
import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { Icon, getInputStyles, useTheme2, Text } from '@grafana/ui';
import { getFocusStyles, getMouseFocusStyles } from '@grafana/ui/internal';

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

  const styles = getStyles(theme, invalid);

  const handleKeyDown = (event: React.KeyboardEvent<SVGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClearSelection?.(event);
    }
  };

  if (isLoading) {
    return <FolderPickerSkeleton />;
  }

  return (
    <div className={triggerStyles.wrapper}>
      <div className={triggerStyles.inputWrapper}>
        {label ? (
          <div className={triggerStyles.prefix}>
            <Icon name="folder" />
          </div>
        ) : undefined}

        <button
          type="button"
          {...mergeStylexClassName(stylex.props(triggerStyles.hasPrefix, triggerStyles.fakeInput, label ?  : undefined), undefined)}
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
              {...stylex.props(triggerStyles.clearIcon)}
              name="times"
              onClick={handleClearSelection}
              onKeyDown={handleKeyDown}
            />
          )}
        </button>

        <div className={triggerStyles.suffix}>
          <Icon name="angle-down" />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Trigger);

