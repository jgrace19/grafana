import { render, screen } from '@testing-library/react';

import { Stack } from './Stack';

describe('Stack', () => {
  it('renders its children', () => {
    render(
      <Stack>
        <span>child</span>
      </Stack>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it.each([
    ['plain values', { direction: 'row', gap: 2 } as const],
    [
      'responsive values with gaps between breakpoints',
      { direction: { xs: 'column', md: 'row' }, gap: { xs: 1, lg: 4 } } as const,
    ],
    ['no optional props', {}],
  ])('builds valid class names for %s', (_name, props) => {
    render(<Stack data-testid="stack" {...props} />);
    const className = screen.getByTestId('stack').className;

    expect(className).not.toMatch(/undefined|NaN|null/);
  });

  it('sets responsive gap values as token vars', () => {
    render(<Stack data-testid="stack" gap={{ xs: 1, lg: 4 }} />);
    const style = screen.getByTestId('stack').getAttribute('style') ?? '';

    expect(style).toContain('var(--gf-spacing-x1)');
    expect(style).toContain('var(--gf-spacing-x4)');
  });
});
