import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer, useOverlay } from '@react-aria/overlays';
import * as stylex from '@stylexjs/stylex';
import { createRef, type FormEvent, memo } from 'react';

import { type DateTime, type TimeZone } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { zIndex } from '../../../themes/stylex/constants.stylex';
import { colors, components, shadows, shape, spacing } from '../../../themes/stylex/tokens.stylex';
import { type WeekStart } from '../WeekStartPicker';

import { Body } from './CalendarBody';
import { Footer } from './CalendarFooter';
import { Header } from './CalendarHeader';

export interface TimePickerCalendarProps {
  isOpen: boolean;
  from: DateTime;
  to: DateTime;
  onClose: () => void;
  onApply: (e: FormEvent<HTMLButtonElement>) => void;
  onChange: (from: DateTime, to: DateTime) => void;
  weekStart?: WeekStart;

  /**
   * When true, the calendar is rendered as a floating "tooltip" next to the input.
   * When false, the calendar is rendered "fullscreen" in a modal. Yes. Don't ask.
   */
  isFullscreen: boolean;
  timeZone?: TimeZone;
  isReversed?: boolean;
}

function TimePickerCalendar(props: TimePickerCalendarProps) {
  const { isOpen, isFullscreen: isFullscreenProp, onClose } = props;
  const ref = createRef<HTMLElement>();
  const { dialogProps } = useDialog(
    {
      'aria-label': selectors.components.TimePicker.calendar.label,
    },
    ref
  );
  const { overlayProps } = useOverlay(
    {
      isDismissable: true,
      isOpen,
      onClose,
    },
    ref
  );

  // This prop is confusingly worded, so rename it to something more intuitive.
  const showInModal = !isFullscreenProp;

  if (!isOpen) {
    return null;
  }

  const calendar = (
    <section
      {...stylex.props(styles.calendar)}
      ref={ref}
      {...overlayProps}
      {...dialogProps}
      data-testid={selectors.components.TimePicker.calendar.label}
    >
      <Header {...props} />
      <Body {...props} />
      {showInModal && <Footer {...props} />}
    </section>
  );

  if (!showInModal) {
    return (
      <FocusScope contain restoreFocus autoFocus>
        <div {...stylex.props(styles.container, props.isReversed ? styles.containerReversed : styles.containerDefault)}>
          {calendar}
        </div>
      </FocusScope>
    );
  }

  return (
    <OverlayContainer>
      <div {...stylex.props(styles.modalBackdrop)} />

      <FocusScope contain autoFocus restoreFocus>
        <div {...stylex.props(styles.modal)}>
          <div {...stylex.props(styles.modalContainer)}>{calendar}</div>
        </div>
      </FocusScope>
    </OverlayContainer>
  );
}
export default memo(TimePickerCalendar);
TimePickerCalendar.displayName = 'TimePickerCalendar';

const styles = stylex.create({
  container: {
    top: 0,
    position: 'absolute',
  },
  // Sits beside the 546px-wide time picker content.
  containerDefault: {
    right: '546px',
  },
  containerReversed: {
    left: '546px',
  },
  modalContainer: {
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  calendar: {
    display: 'flex',
    flexDirection: 'column',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    boxShadow: shadows['--gf-shadows-z3'],
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  modal: {
    boxShadow: shadows['--gf-shadows-z3'],
    left: '50%',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: zIndex.modal,
  },
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
