import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer, useOverlay } from '@react-aria/overlays';
import { createRef, type FormEvent, memo } from 'react';

import { type DateTime, type TimeZone } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { useStyles2 } from '../../../themes/ThemeContext';
import { getModalStyles } from '../../Modal/getModalStyles';
import { type WeekStart } from '../WeekStartPicker';

import { Body } from './CalendarBody';
import { Footer } from './CalendarFooter';
import { Header } from './CalendarHeader';
import { timePickerCalendarStyleProps } from './TimePickerCalendar.stylex';

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
  const { modalBackdrop } = useStyles2(getModalStyles);
  const { isOpen, isFullscreen: isFullscreenProp, onClose, isReversed } = props;
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

  const showInModal = !isFullscreenProp;

  if (!isOpen) {
    return null;
  }

  const calendar = (
    <section
      {...timePickerCalendarStyleProps('calendar')}
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
        <div {...timePickerCalendarStyleProps(isReversed ? 'containerLeft' : 'containerRight')}>{calendar}</div>
      </FocusScope>
    );
  }

  return (
    <OverlayContainer>
      <div className={modalBackdrop} />

      <FocusScope contain autoFocus restoreFocus>
        <div {...timePickerCalendarStyleProps('modal')}>
          <div {...timePickerCalendarStyleProps('modalContainer')}>{calendar}</div>
        </div>
      </FocusScope>
    </OverlayContainer>
  );
}
export default memo(TimePickerCalendar);
TimePickerCalendar.displayName = 'TimePickerCalendar';
