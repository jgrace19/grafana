import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createTheme } from '@grafana/data';

import { ColorPickerPopover } from './ColorPickerPopover';

describe('ColorPickerPopover', () => {
  const theme = createTheme();

  it('should be tabbable', async () => {
    render(<ColorPickerPopover color={'red'} onChange={() => {}} />);
    const color = screen.getByRole('button', { name: 'dark-red color' });
    const customTab = screen.getByRole('tab', { name: 'Custom' });

    await userEvent.tab();
    expect(customTab).toHaveFocus();

    await userEvent.tab();
    expect(color).toHaveFocus();
  });

  describe('rendering', () => {
    it('should render provided color as selected if color provided by name', async () => {
      render(<ColorPickerPopover color={'green'} onChange={() => {}} />);
      const color = screen.getByRole('button', { name: 'green color' });
      const colorSwatchWrapper = screen.getAllByTestId('data-testid-colorswatch');

      expect(color).toBeInTheDocument();
      expect(colorSwatchWrapper[0]).toBeInTheDocument();

      await userEvent.click(colorSwatchWrapper[0]);
      // StyleX dynamic value: jsdom only sees the inline custom property, so check the value reached the swatch.
      const selectedShadow = 'inset 0 0 0 2px #73BF69, inset 0 0 0 4px #000000';
      // eslint-disable-next-line jest-dom/prefer-to-have-style
      expect(color).toHaveAttribute('style', expect.stringContaining(selectedShadow));
    });
  });

  describe('named colors support', () => {
    const onChangeSpy = jest.fn();

    it('should pass hex color value to onChange prop by default', async () => {
      render(<ColorPickerPopover color={'red'} onChange={onChangeSpy} />);
      const color = screen.getByRole('button', { name: 'red color' });
      await userEvent.click(color);

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(theme.visualization.getColorByName('red'));
    });

    it('should pass color name to onChange prop when named colors enabled', async () => {
      render(<ColorPickerPopover color={'red'} enableNamedColors onChange={onChangeSpy} />);
      const color = screen.getByRole('button', { name: 'red color' });
      await userEvent.click(color);

      expect(onChangeSpy).toBeCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith(theme.visualization.getColorByName('red'));
    });
  });
});
