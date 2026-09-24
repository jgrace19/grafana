import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LogLineMessage } from './LogLineMessage';

describe('LogLineMessage', () => {
  test('Renders a log line message', () => {
    render(<LogLineMessage style={{}}>Message</LogLineMessage>);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  test('Renders a button with the message', async () => {
    const handleClick = jest.fn();
    render(
      <LogLineMessage style={{}} onClick={handleClick}>
        Message
      </LogLineMessage>
    );
    await userEvent.click(screen.getByText('Message'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
