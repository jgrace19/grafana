import clsx from 'clsx';

import { confirmButtonStyleProps } from './ConfirmButton.stylex'

import { type ReactElement, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { Trans } from '@grafana/i18n';

import { type ComponentSize } from '../../types/size';
import { Button, type ButtonVariant } from '../Button/Button';

export interface Props {
  /** Confirm action callback */
  onConfirm(): void;
  children: string | ReactElement<Record<string, unknown>>;
  /** Custom button styles */
  className?: string;
  /** Button size */
  size?: ComponentSize;
  /** Text for the Confirm button */
  confirmText?: string;
  /** Disable button click action */
  disabled?: boolean;
  /** Variant of the Confirm button */
  confirmVariant?: ButtonVariant;
  /** Hide confirm actions when after of them is clicked */
  closeOnConfirm?: boolean;
  /** Optional on click handler for the original button */
  onClick?(): void;
  /** Callback for the cancel action */
  onCancel?(): void;
}

/**
 * The ConfirmButton is an interactive component that adds a double-confirm option to a clickable action. When clicked, the action is replaced by an inline confirmation with the option to cancel. In Grafana, this is used, for example, for editing values in settings tables.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-confirmbutton--docs
 */
export const ConfirmButton = ({
  children,
  className,
  closeOnConfirm,
  confirmText = 'Save',
  confirmVariant = 'primary',
  disabled = false,
  onCancel,
  onClick,
  onConfirm,
  size = 'md',
}: Props) => {
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);

  useEffect(() => {
    if (showConfirm) {
      confirmButtonRef.current?.focus();
      setShouldRestoreFocus(true);
    } else {
      if (shouldRestoreFocus) {
        mainButtonRef.current?.focus();
        setShouldRestoreFocus(false);
      }
    }
  }, [shouldRestoreFocus, showConfirm]);

  const onClickButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }

    setShowConfirm(true);
    onClick?.();
  };

  const onClickCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    setShowConfirm(false);
    mainButtonRef.current?.focus();
    onCancel?.();
  };

  const onClickConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    onConfirm?.();
    if (closeOnConfirm) {
      setShowConfirm(false);
    }
  };

  const buttonClass = clsx(
    className,
    confirmButtonStyleProps('mainButton').className,
    showConfirm && confirmButtonStyleProps('mainButtonHide').className
  );
  const confirmButtonClass = clsx(
    confirmButtonStyleProps('confirmButton').className,
    !showConfirm && confirmButtonStyleProps('confirmButtonHide').className
  );
  const confirmButtonContainerClass = clsx(
    confirmButtonStyleProps('confirmButtonContainer').className,
    !showConfirm && confirmButtonStyleProps('confirmButtonContainerHide').className
  );

  return (
    <div {...confirmButtonStyleProps('container')}>
      <span className={buttonClass}>
        {typeof children === 'string' ? (
          <Button disabled={disabled} size={size} fill="text" onClick={onClickButton} ref={mainButtonRef}>
            {children}
          </Button>
        ) : (
          React.cloneElement(children, { disabled, onClick: onClickButton, ref: mainButtonRef })
        )}
      </span>
      <div className={confirmButtonContainerClass}>
        <span className={confirmButtonClass}>
          <Button size={size} variant={confirmVariant} onClick={onClickConfirm} ref={confirmButtonRef}>
            {confirmText}
          </Button>
          <Button size={size} fill="text" onClick={onClickCancel}>
            <Trans i18nKey="grafana-ui.confirm-button.cancel">Cancel</Trans>
          </Button>
        </span>
      </div>
    </div>
  );
};
ConfirmButton.displayName = 'ConfirmButton';

;
