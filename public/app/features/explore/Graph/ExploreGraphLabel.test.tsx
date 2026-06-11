import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ExploreGraphLabel } from './ExploreGraphLabel';

describe('ExploreGraphLabel', () => {
  const noop = () => {};

  it('renders both the style group and the Linear/Logarithmic scale group', () => {
    render(
      <ExploreGraphLabel graphStyle="lines" onChangeGraphStyle={noop} graphScale="linear" onChangeGraphScale={noop} />
    );

    expect(screen.getByLabelText('Y-axis scale')).toBeInTheDocument();
    expect(screen.getByLabelText('Graph style')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Linear' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Logarithmic' })).toBeInTheDocument();
  });

  it('reflects the selected scale', () => {
    render(
      <ExploreGraphLabel graphStyle="lines" onChangeGraphStyle={noop} graphScale="log" onChangeGraphScale={noop} />
    );

    expect(screen.getByRole('radio', { name: 'Logarithmic' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Linear' })).not.toBeChecked();
  });

  it('calls onChangeGraphScale when the user picks a different scale', async () => {
    const user = userEvent.setup();
    const onChangeGraphScale = jest.fn();

    render(
      <ExploreGraphLabel
        graphStyle="lines"
        onChangeGraphStyle={noop}
        graphScale="linear"
        onChangeGraphScale={onChangeGraphScale}
      />
    );

    await user.click(screen.getByRole('radio', { name: 'Logarithmic' }));
    expect(onChangeGraphScale).toHaveBeenCalledWith('log');
  });

  it('disables the Logarithmic option when the graph style is stacked', () => {
    render(
      <ExploreGraphLabel
        graphStyle="stacked_lines"
        onChangeGraphStyle={noop}
        graphScale="linear"
        onChangeGraphScale={noop}
      />
    );

    // When the option carries a description, RadioButtonGroup wraps the
    // input in a Tooltip, which removes it from the default accessibility
    // tree; getByLabelText still resolves it via the for/id association.
    const logOption = screen.getByLabelText('Logarithmic');
    expect(logOption).toBeDisabled();

    const linearOption = screen.getByRole('radio', { name: 'Linear' });
    expect(linearOption).not.toBeDisabled();
  });

  it('keeps the Logarithmic option enabled for non-stacked styles', () => {
    render(
      <ExploreGraphLabel graphStyle="bars" onChangeGraphStyle={noop} graphScale="linear" onChangeGraphScale={noop} />
    );

    expect(screen.getByRole('radio', { name: 'Logarithmic' })).not.toBeDisabled();
  });
});
