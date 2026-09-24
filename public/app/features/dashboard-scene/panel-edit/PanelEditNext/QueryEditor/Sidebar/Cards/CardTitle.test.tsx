import { render, screen } from '@testing-library/react';

import { CardTitle } from './CardTitle';

// StyleX styles aren't visible to jsdom; the strikethrough and truncation are covered by the visual captures.
describe('CardTitle', () => {
  it('renders title text correctly', () => {
    render(<CardTitle title="Test Query" isHidden={false} />);

    expect(screen.getByText('Test Query')).toBeInTheDocument();
  });

  it('styles a hidden title differently from a visible one', () => {
    const { unmount } = render(<CardTitle title="Hidden Query" isHidden={true} />);
    const hiddenClassName = screen.getByText('Hidden Query').className;
    unmount();

    render(<CardTitle title="Visible Query" isHidden={false} />);
    const visibleClassName = screen.getByText('Visible Query').className;

    expect(hiddenClassName).not.toBe(visibleClassName);
  });

  it('renders a visible title as a single span', () => {
    const { container } = render(<CardTitle title="Visible Query" isHidden={false} />);

    expect(container.children).toHaveLength(1);
    expect(screen.getByText('Visible Query').tagName).toBe('SPAN');
  });

  it('keeps long titles on one element so they can be truncated', () => {
    const { container } = render(<CardTitle title="Very Long Query Name" isHidden={false} />);

    const titleSpan = container.querySelector('span');
    expect(titleSpan).toHaveTextContent('Very Long Query Name');
    expect(titleSpan?.children).toHaveLength(0);
  });
});
