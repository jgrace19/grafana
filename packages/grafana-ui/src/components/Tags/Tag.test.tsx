import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { JSX } from 'react';

import { getThemeById } from '@grafana/data';

import {
  appendConsumerStyles,
  getCascadedStyle,
  getResolvedStyle,
  ThemeCssVariables,
} from '../../themes/stylex/testUtils';
import { getTagColor, getTagColorsFromName } from '../../utils/tags';

import { Tag } from './Tag';

const setup = (jsx: JSX.Element) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

const mockOnClick = jest.fn();

describe('Tag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with icon when provided', () => {
    render(<Tag name="test-tag" icon="info-circle" />);

    const tag = screen.getByText('test-tag');
    expect(tag).toBeInTheDocument();
    expect(tag.parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const { user } = setup(<Tag name="test-tag" onClick={mockOnClick} />);

    const tag = screen.getByText('test-tag');
    await user.click(tag);

    expect(mockOnClick).toHaveBeenCalledWith('test-tag', expect.any(Object));
  });

  it('should render as button when onClick is provided', () => {
    render(<Tag name="test-tag" onClick={mockOnClick} />);

    const tag = screen.getByRole('button', { name: 'test-tag' });
    expect(tag).toBeInTheDocument();
  });

  it('should not render as button when onClick is not provided', () => {
    render(<Tag name="test-tag" />);

    const tag = screen.queryByRole('button', { name: 'test-tag' });
    expect(tag).not.toBeInTheDocument();
  });

  describe('styles', () => {
    it.each(['dark', 'light'])('resolves theme tokens in the %s theme', (themeId) => {
      const theme = getThemeById(themeId);
      render(
        <>
          <ThemeCssVariables theme={theme} />
          <Tag name="test-tag" colorIndex={0} />
        </>
      );

      const tag = screen.getByText('test-tag');
      expect(getResolvedStyle(tag, 'background-color')).toBe(getTagColor(0).color);
      expect(getResolvedStyle(tag, 'color')).toBe(theme.v1.palette.gray98);
      expect(getResolvedStyle(tag, 'font-size')).toBe(theme.typography.size.sm);
      expect(getResolvedStyle(tag, 'font-weight')).toBe(String(theme.typography.fontWeightMedium));
      expect(getResolvedStyle(tag, 'line-height')).toBe(String(theme.typography.bodySmall.lineHeight));
      expect(getResolvedStyle(tag, 'border-radius')).toBe(theme.shape.radius.sm);
      expect(getCascadedStyle(tag, 'padding-block')).toBe('3px');
      expect(getCascadedStyle(tag, 'padding-inline')).toBe('6px');
      expect(getCascadedStyle(tag, 'white-space')).toBe('pre');
    });

    it('derives the background color from the tag name when no colorIndex is given', () => {
      render(<Tag name="some-tag-name" />);
      expect(getResolvedStyle(screen.getByText('some-tag-name'), 'background-color')).toBe(
        getTagColorsFromName('some-tag-name').color
      );
    });

    it('only applies hover styles to clickable tags', () => {
      render(
        <>
          <Tag name="clickable" onClick={mockOnClick} />
          <Tag name="static" />
        </>
      );

      const clickable = screen.getByRole('button', { name: 'clickable' });
      expect(Number(getCascadedStyle(clickable, 'opacity', { pseudoClass: ':hover' }))).toBe(0.85);
      expect(getCascadedStyle(clickable, 'cursor', { pseudoClass: ':hover' })).toBe('pointer');
      expect(getCascadedStyle(clickable, 'opacity')).toBe('');
      expect(getCascadedStyle(screen.getByText('static'), 'opacity', { pseudoClass: ':hover' })).toBe('');
    });

    it('lets consumer className and style override the defaults', () => {
      appendConsumerStyles('.consumer-tag { background-color: rgb(1, 2, 3); }');
      render(<Tag name="custom" colorIndex={0} className="consumer-tag" style={{ marginLeft: '4px' }} />);

      const tag = screen.getByText('custom');
      expect(tag).toHaveClass('consumer-tag');
      expect(getCascadedStyle(tag, 'background-color')).toBe('rgb(1, 2, 3)');
      expect(tag).toHaveStyle({ marginLeft: '4px' });
      expect(tag.style.getPropertyValue('--x-backgroundColor')).toBe(getTagColor(0).color);
    });
  });
});
