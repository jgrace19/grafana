import { type Placement } from '@popperjs/core';
import * as stylex from '@stylexjs/stylex';
import classnames from 'classnames';
import { type ReactElement, type ReactNode, cloneElement, useRef } from 'react';

import { Popover as GrafanaPopover, PopoverController, Stack } from '@grafana/ui';
import { colors, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface PopupCardProps {
  children: ReactElement<Record<string, unknown>>;
  header?: ReactNode;
  content: ReactElement;
  footer?: ReactNode;
  wrapperClassName?: string;
  placement?: Placement;
  disabled?: boolean;
  showAfter?: number;
  arrow?: boolean;
  showOn?: 'click' | 'hover';
  disableBlur?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const PopupCard = ({
  children,
  header,
  content,
  footer,
  arrow,
  showAfter = 300,
  wrapperClassName,
  disabled = false,
  showOn = 'hover',
  disableBlur = false,
  isOpen,
  onClose,
  onToggle,
  ...rest
}: PopupCardProps) => {
  const popoverRef = useRef<HTMLElement>(null);

  if (disabled) {
    return children;
  }

  const showOnHover = showOn === 'hover';
  const showOnClick = showOn === 'click';

  const body = (
    <Stack direction="column" gap={0} role="tooltip">
      {header && <div {...stylex.props(styles.cardHeader)}>{header}</div>}
      <div {...stylex.props(styles.cardBody)}>{content}</div>
      {footer && <div {...stylex.props(styles.cardFooter)}>{footer}</div>}
    </Stack>
  );

  return (
    <PopoverController content={body} hideAfter={100}>
      {(showPopper, hidePopper, popperProps) => {
        // Use manual control if provided, otherwise use internal state
        const isManuallyControlled = isOpen !== undefined;
        const shouldShow = isManuallyControlled ? isOpen : popperProps.show;

        const handleClose = () => {
          if (onClose) {
            onClose();
          } else {
            hidePopper();
          }
        };

        const handleShow = () => {
          if (!isManuallyControlled) {
            showPopper();
          }
        };

        // support hover and click interaction
        const onClickProps = {
          onClick: onToggle || (isManuallyControlled ? handleClose : showPopper),
        };

        const onHoverProps = {
          onMouseLeave: handleClose,
          onMouseEnter: handleShow,
        };

        const blurFocusProps = {
          onBlur: handleClose,
          onFocus: handleShow,
        };

        return (
          <>
            {popoverRef.current && (
              <GrafanaPopover
                {...popperProps}
                show={shouldShow}
                {...rest}
                wrapperClassName={classnames(stylex.props(styles.popover).className, wrapperClassName)}
                referenceElement={popoverRef.current}
                renderArrow={arrow}
                // @TODO
                // if we want interaction with the content we should not pass blur / focus handlers but then clicking outside doesn't close the popper
                {...(disableBlur ? {} : blurFocusProps)}
                // if we want hover interaction we have to make sure we add the leave / enter handlers
                {...(showOnHover ? onHoverProps : {})}
                hidePopper={handleClose}
              />
            )}

            {cloneElement(children, {
              ref: popoverRef,
              onFocus: handleShow,
              onBlur: disableBlur ? undefined : handleClose,
              tabIndex: 0,
              // make sure we pass the correct interaction handlers here to the element we want to interact with
              ...(showOnHover ? onHoverProps : {}),
              // Only add click handling if we have onToggle or not manually controlled
              ...(showOnClick && (onToggle || !isManuallyControlled) ? onClickProps : {}),
            })}
          </>
        );
      }}
    </PopoverController>
  );
};

const styles = stylex.create({
  popover: {
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
  },
  cardBody: {
    padding: spacing['--gf-spacing-x1'],
  },
  cardHeader: {
    padding: spacing['--gf-spacing-x1'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
  },
  cardFooter: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
  },
});
