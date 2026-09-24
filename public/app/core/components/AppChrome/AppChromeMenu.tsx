import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer, useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { useTheme2 } from '@grafana/ui';
import { bp, durations, easings, motion, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, shadows } from '@grafana/ui/stylex/tokens.stylex';
import { useGrafana } from 'app/core/context/GrafanaContext';

import { MegaMenu } from './MegaMenu/MegaMenu';
import { megaMenu } from './MegaMenu/megaMenu.stylex';

interface Props {}

export function AppChromeMenu({}: Props) {
  const theme = useTheme2();
  const { chrome } = useGrafana();
  const state = chrome.useState();

  const ref = useRef(null);
  const backdropRef = useRef(null);
  const animationSpeed = theme.transitions.duration.shortest;

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
    <div {...stylex.props(styles.wrapper)}>
      <OverlayContainer>
        <CSSTransition
          nodeRef={ref}
          in={isOpen}
          unmountOnExit={true}
          classNames={overlayClassNames}
          timeout={{ enter: animationSpeed, exit: 0 }}
        >
          <>
            {isOpen && (
              <FocusScope contain autoFocus restoreFocus>
                <MegaMenu
                  className={stylex.props(styles.menu).className}
                  onClose={onClose}
                  ref={ref}
                  {...overlayProps}
                  {...dialogProps}
                />
              </FocusScope>
            )}
          </>
        </CSSTransition>
        <CSSTransition
          nodeRef={backdropRef}
          in={isOpen}
          unmountOnExit={true}
          classNames={backdropClassNames}
          timeout={{ enter: animationSpeed, exit: 0 }}
        >
          <div ref={backdropRef} {...stylex.props(styles.backdrop)} {...underlayProps} />
        </CSSTransition>
      </OverlayContainer>
    </div>
  );
}

const styles = stylex.create({
  backdrop: {
    backgroundColor: components['--gf-components-overlay-background'],
    bottom: 0,
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
    zIndex: zIndex.modalBackdrop,
  },
  menu: {
    display: 'flex',
    bottom: 0,
    flexDirection: 'column',
    left: 0,
    right: { default: 0, [bp.mdUp]: 'unset' },
    // Needs to below navbar should we change the navbarFixed? add add a new level?
    zIndex: zIndex.modal,
    position: 'fixed',
    top: 0,
    backgroundColor: colors['--gf-colors-background-primary'],
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  wrapper: {
    position: 'fixed',
    display: 'grid',
    gridAutoFlow: 'column',
    height: '100%',
    zIndex: zIndex.sidemenu,
  },
});

// CSSTransition applies `enter` and `enterActive` together: the open values win because StyleX orders
// media-wrapped rules last, then same-property rules by value (`width:0` < `width:100%`, `opacity:0` < `opacity:1`).
const animStyles = stylex.create({
  transition: {
    transitionDuration: { default: null, [motion.noPreference]: durations.shortest },
    transitionTimingFunction: { default: null, [motion.noPreference]: easings.easeInOut },
    overflow: { default: null, [bp.mdDown]: 'hidden' },
  },
  overlayTransition: {
    transitionProperty: 'box-shadow, width',
  },
  backdropTransition: {
    transitionProperty: 'opacity',
  },
  overlayOpen: {
    width: { default: '100%', [bp.mdUp]: megaMenu.width },
    borderRightWidth: { default: null, [bp.mdUp]: '1px' },
    borderRightStyle: { default: null, [bp.mdUp]: 'solid' },
    borderRightColor: { default: null, [bp.mdUp]: colors['--gf-colors-border-weak'] },
    boxShadow: { default: null, [bp.mdUp]: shadows['--gf-shadows-z3'] },
  },
  overlayClosed: {
    boxShadow: 'none',
    width: 0,
  },
  backdropOpen: {
    opacity: 1,
  },
  backdropClosed: {
    opacity: 0,
  },
});

const backdropClassNames = {
  enter: stylex.props(animStyles.backdropClosed).className,
  enterActive: stylex.props(animStyles.transition, animStyles.backdropTransition, animStyles.backdropOpen).className,
  enterDone: stylex.props(animStyles.backdropOpen).className,
};

const overlayClassNames = {
  enter: stylex.props(animStyles.overlayClosed).className,
  enterActive: stylex.props(animStyles.transition, animStyles.overlayTransition, animStyles.overlayOpen).className,
  enterDone: stylex.props(animStyles.overlayOpen).className,
};
