import { FloatingFocusManager, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react';
import { OverlayContainer } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren } from 'react';

import { zIndex } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape } from '../../themes/stylex/tokens.stylex';
import { getPortalContainer } from '../Portal/Portal';

export interface ModalBaseProps {
  className?: string;
  /** @internal first-party StyleX overrides for the modal container */
  xstyle?: stylex.StyleXStyles;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  trapFocus?: boolean;
  isOpen?: boolean;
  onDismiss?: () => void;
  onClickBackdrop?: () => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export function ModalBase({
  children,
  className,
  xstyle,
  isOpen = false,
  closeOnEscape = true,
  closeOnBackdropClick = false,
  trapFocus = true,
  onDismiss,
  onClickBackdrop,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: PropsWithChildren<ModalBaseProps>) {
  const { context, refs } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        onDismiss?.();
      }
    },
  });

  const dismiss = useDismiss(context, {
    escapeKey: closeOnEscape,
    outsidePress: () => {
      if (onClickBackdrop) {
        onClickBackdrop();
        return false;
      }
      return closeOnBackdropClick;
    },
  });

  const role = useRole(context, {
    role: 'dialog',
  });

  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!isOpen) {
    return null;
  }

  return (
    <OverlayContainer>
      <div role="presentation" {...stylex.props(modalStyles.modalBackdrop)} />
      <FloatingFocusManager context={context} modal={trapFocus} getInsideElements={() => [getPortalContainer()]}>
        <div
          {...mergeStylexProps(stylex.props(styles.modal, xstyle), { className })}
          ref={refs.setFloating}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...getFloatingProps()}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </OverlayContainer>
  );
}

// Centre the modal vertically on smaller height screens, this allows us to fill the full height for maximum usability
const smallHeight = '@media (max-height: 750px)';

const styles = stylex.create({
  modal: {
    position: 'fixed',
    zIndex: zIndex.modal,
    backgroundColor: colors['--gf-colors-background-primary'],
    boxShadow: shadows['--gf-shadows-z3'],
    borderRadius: shape['--gf-shape-radius-lg'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    backgroundClip: 'padding-box',
    outlineStyle: 'none',
    width: '750px',
    maxWidth: '100%',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: { default: '10%', [smallHeight]: '50%' },
    maxHeight: { default: '80%', [smallHeight]: '100%' },
    transform: { default: null, [smallHeight]: 'translateY(-50%)' },
    display: 'flex',
    flexDirection: 'column',
  },
});

/** Modal styles shared with components that render their own modal-like overlay (the date/time pickers). */
export const modalStyles = stylex.create({
  modalBackdrop: {
    position: 'fixed',
    zIndex: zIndex.modalBackdrop,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: components['--gf-components-overlay-background'],
  },
});

/**
 * The modal container look, for first-party code that renders its own dialog (TokenRevokedModal).
 *
 * @internal
 */
export { styles as modalContainerStyles };
