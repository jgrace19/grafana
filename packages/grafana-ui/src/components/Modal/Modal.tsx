import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren, type ReactNode, useId, type JSX } from 'react';

import { t } from '@grafana/i18n';

import { bp } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { IconButton } from '../IconButton/IconButton';
import { Stack } from '../Layout/Stack/Stack';

import { ModalBase } from './ModalBase';
import { ModalHeader } from './ModalHeader';

interface BaseProps {
  className?: string;
  /** @internal first-party StyleX overrides for the modal container */
  xstyle?: stylex.StyleXStyles;
  contentClassName?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  trapFocus?: boolean;

  isOpen?: boolean;
  onDismiss?: () => void;

  /** If not set will call onDismiss if that is set. */
  onClickBackdrop?: () => void;
}

interface WithStringTitleProps extends BaseProps {
  /** Title for the modal or custom header element */
  title: string;
  ariaLabel?: never;
}

interface WithCustomTitleProps extends BaseProps {
  /** Title for the modal or custom header element */
  title: JSX.Element;
  /** aria-label for the dialog. only needed when passing a custom title element */
  ariaLabel: string;
}

export type Props = WithStringTitleProps | WithCustomTitleProps;

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-modal--docs
 */
export function Modal(props: PropsWithChildren<Props>) {
  const {
    title,
    ariaLabel,
    children,
    isOpen = false,
    closeOnEscape = true,
    closeOnBackdropClick = true,
    className,
    xstyle,
    contentClassName,
    onDismiss,
    onClickBackdrop,
    trapFocus = true,
  } = props;
  const titleId = useId();

  return (
    <ModalBase
      isOpen={isOpen}
      onDismiss={onDismiss}
      closeOnEscape={closeOnEscape}
      closeOnBackdropClick={closeOnBackdropClick}
      trapFocus={trapFocus}
      className={className}
      xstyle={xstyle}
      onClickBackdrop={onClickBackdrop}
      aria-label={ariaLabel}
      aria-labelledby={typeof title === 'string' ? titleId : undefined}
    >
      <div {...stylex.props(styles.modalHeader, typeof title !== 'string' && styles.modalHeaderWithTabs)}>
        {typeof title === 'string' && <ModalHeader title={title} id={titleId} />}
        {
          // FIXME: custom title components won't get an accessible title.
          // Do we really want to support them or shall we just limit this ModalTabsHeader?
          typeof title !== 'string' && title
        }
        <div {...stylex.props(styles.modalHeaderClose)}>
          <IconButton
            name="times"
            size="xl"
            onClick={onDismiss}
            aria-label={t('grafana-ui.modal.close-tooltip', 'Close')}
          />
        </div>
      </div>
      <div {...mergeStylexProps(stylex.props(styles.modalContent), { className: contentClassName })}>{children}</div>
    </ModalBase>
  );
}

function ModalButtonRow({ leftItems, children }: { leftItems?: ReactNode; children: ReactNode }) {
  if (leftItems) {
    return (
      <div {...stylex.props(styles.modalButtonRow)}>
        <Stack justifyContent="space-between">
          <Stack justifyContent="flex-start" gap={2}>
            {leftItems}
          </Stack>
          <Stack justifyContent="flex-end" gap={2}>
            {children}
          </Stack>
        </Stack>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.modalButtonRow)}>
      <Stack justifyContent="flex-end" gap={2} wrap="wrap">
        {children}
      </Stack>
    </div>
  );
}

Modal.ButtonRow = ModalButtonRow;

const styles = stylex.create({
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '42px',
    marginTop: { default: spacing['--gf-spacing-x1'], [bp.smDown]: 0 },
    marginRight: { default: spacing['--gf-spacing-x2'], [bp.smDown]: spacing['--gf-spacing-x1'] },
    marginBottom: 0,
    marginLeft: { default: spacing['--gf-spacing-x2'], [bp.smDown]: spacing['--gf-spacing-x1'] },
  },
  modalHeaderWithTabs: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  modalHeaderClose: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: colors['--gf-colors-text-secondary'],
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    overflow: 'auto',
    paddingTop: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x1'] },
    paddingRight: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x2'] },
    paddingBottom: 0,
    paddingLeft: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x2'] },
    marginBottom: { default: spacing['--gf-spacing-x2-5'], [bp.smDown]: spacing['--gf-spacing-x2'] },
    scrollbarWidth: 'thin',
    width: '100%',
  },
  modalButtonRow: {
    backgroundColor: colors['--gf-colors-background-primary'],
    position: 'sticky',
    bottom: 0,
    paddingTop: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    zIndex: 1,
  },
});
