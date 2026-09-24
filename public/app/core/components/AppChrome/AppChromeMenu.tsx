import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { appChromeMenuStyles } from './AppChromeMenu.stylex';
import { appChromeMenuTransitionStyles } from './AppChromeMenu.transition.stylex';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer, useOverlay } from '@react-aria/overlays';
import { useMemo, useRef } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { useTheme2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';

import { MegaMenu } from './MegaMenu/MegaMenu';

interface Props {}

export function AppChromeMenu({}: Props) {
  const theme = useTheme2();
  const { chrome } = useGrafana();
  const state = chrome.useState();

  const ref = useRef(null);
  const backdropRef = useRef(null);
  const animationSpeed = theme.transitions.duration.shortest;
  const animationClassNames = useMemo(
    () => ({
      backdrop: {
        enter: mergeStylexClassName(stylex.props(appChromeMenuTransitionStyles.backdropEnter), undefined).className,
        enterActive: mergeStylexClassName(stylex.props(appChromeMenuTransitionStyles.backdropEnterActive), undefined)
          .className,
        enterDone: mergeStylexClassName(stylex.props(appChromeMenuTransitionStyles.backdropEnterDone), undefined)
          .className,
      },
      overlay: {
        enter: mergeStylexClassName(stylex.props(appChromeMenuTransitionStyles.overlayEnter), undefined).className,
        enterActive: mergeStylexClassName(stylex.props(appChromeMenuTransitionStyles.overlayEnterActive), undefined)
          .className,
        enterDone: mergeStylexClassName(stylex.props(appChromeMenuTransitionStyles.overlayEnterDone), undefined)
          .className,
      },
    }),
    []
  );

  const isOpen = state.megaMenuOpen && !state.megaMenuDocked;
  const onClose = () => chrome.setMegaMenuOpen(false);

  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable: true,
      isOpen: true,
      onClose,
      shouldCloseOnInteractOutside: (element) => {
        // don't close when interacting with a select menu inside the mega menu
        // e.g. for the org switcher
        const isSelectMenu = document
          .querySelector(`[data-testid="${selectors.components.Select.menu}"]`)
          ?.contains(element);
        return !isSelectMenu;
      },
    },
    ref
  );
  const { dialogProps } = useDialog({ 'aria-label': t('navigation.megamenu.dialog-label', 'Navigation') }, ref);

  return (
    <div {...stylex.props(appChromeMenuStyles.wrapper)}>
      <OverlayContainer>
        <CSSTransition
          nodeRef={ref}
          in={isOpen}
          unmountOnExit={true}
          classNames={animationClassNames.overlay}
          timeout={{ enter: animationSpeed, exit: 0 }}
        >
          <>
            {isOpen && (
              <FocusScope contain autoFocus restoreFocus>
                <MegaMenu {...stylex.props(appChromeMenuStyles.menu)} onClose={onClose} ref={ref} {...overlayProps} {...dialogProps} />
              </FocusScope>
            )}
          </>
        </CSSTransition>
        <CSSTransition
          nodeRef={backdropRef}
          in={isOpen}
          unmountOnExit={true}
          classNames={animationClassNames.backdrop}
          timeout={{ enter: animationSpeed, exit: 0 }}
        >
          <div ref={backdropRef} {...stylex.props(appChromeMenuStyles.backdrop)} {...underlayProps} />
        </CSSTransition>
      </OverlayContainer>
    </div>
  );
}
