import { render, screen } from '@testing-library/react';

import { type ThemeTypographyVariantTypes } from '@grafana/data';

import { Text } from './Text';

describe('Text', () => {
  it('renders correctly', () => {
    render(<Text element={'h1'}>This is a text component</Text>);
    expect(screen.getByText('This is a text component')).toBeInTheDocument();
  });
  // Variant and colour are static StyleX styles, which jsdom can't compute; the visual captures cover them.
  it('keeps the element type when a variant is set', () => {
    const customVariant: keyof ThemeTypographyVariantTypes = 'body';
    render(
      <Text element={'h1'} variant={customVariant}>
        This is a text component
      </Text>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'This is a text component' })).toBeInTheDocument();
  });
  it('renders with a colour', () => {
    render(
      <Text element={'h1'} color="info">
        This is a text component
      </Text>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'This is a text component' })).toBeInTheDocument();
  });
  it('applies the text alignment', () => {
    render(
      <Text element={'p'} textAlignment="center">
        Centered
      </Text>
    );
    // A StyleX dynamic style: the value is set as an inline custom property with a hashed name.
    // eslint-disable-next-line jest-dom/prefer-to-have-style
    expect(screen.getByText('Centered')).toHaveAttribute('style', expect.stringContaining('center'));
  });
});
