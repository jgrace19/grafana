import { render, screen } from '@testing-library/react';

import { Box } from './Box';

describe('Box', () => {
  it('renders the requested element', () => {
    render(
      <Box element="section" data-testid="box">
        content
      </Box>
    );
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('keeps its dynamic styles when a caller forwards a style prop at runtime', () => {
    // BoxProps omits `style`, but Menu forwards ContextMenu's positioning through it.
    const forwarded = { style: { position: 'fixed', left: '10px' } } as {};
    render(<Box padding={1} data-testid="box" {...forwarded} />);
    const style = screen.getByTestId('box').getAttribute('style') ?? '';

    expect(style).toContain('position: fixed');
    expect(style).toContain('left: 10px');
    expect(style).toContain('calc(var(--gf-spacing-grid-size) * 1)');
  });
});
