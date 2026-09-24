import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type Scope, type ScopeNode } from '@grafana/data';

import { ScopesInput, type ScopesInputProps } from './ScopesInput';

const nodes: Record<string, ScopeNode> = {
  'parent-node': {
    metadata: { name: 'parent-node' },
    spec: { linkId: '', linkType: 'scope', parentName: '', nodeType: 'container', title: 'Parent node' },
  },
};

jest.mock('./useScopeNode', () => ({
  useScopeNode: (scopeNodeId?: string) => ({ node: scopeNodeId ? nodes[scopeNodeId] : undefined, isLoading: false }),
}));

const scope: Scope = {
  metadata: { name: 'scope-1' },
  spec: { title: 'Scope 1', defaultPath: ['parent-node', 'scope-node'] },
};

function setup(props: Partial<ScopesInputProps> = {}) {
  const onInputClick = jest.fn();
  render(
    <ScopesInput
      nodes={nodes}
      scopes={{ 'scope-1': scope }}
      appliedScopes={[]}
      disabled={false}
      loading={false}
      onInputClick={onInputClick}
      onRemoveAllClick={jest.fn()}
      {...props}
    />
  );
  return { onInputClick, input: screen.getByTestId('scopes-selector-input') };
}

describe('ScopesInput', () => {
  it('shows the placeholder when no scope is applied', () => {
    const { input } = setup();

    expect(input).toHaveTextContent('No scopes');
    expect(input).toHaveAttribute('data-value', '');
  });

  it('shows the applied scopes with the parent node title', () => {
    const { input } = setup({ appliedScopes: [{ scopeId: 'scope-1' }] });

    expect(input).toHaveTextContent('Parent node');
    expect(input).toHaveTextContent('Scope 1');
    expect(input).toHaveAttribute('data-value', 'Scope 1');
    expect(input).not.toHaveTextContent('No scopes');
  });

  it('shows a spinner instead of the placeholder while loading', () => {
    const { input } = setup({ loading: true });

    expect(screen.getByTestId('Spinner')).toBeInTheDocument();
    expect(input).not.toHaveTextContent('No scopes');
  });

  it('opens the selector on click', async () => {
    const { input, onInputClick } = setup();

    await userEvent.click(input);

    expect(onInputClick).toHaveBeenCalledTimes(1);
  });

  it('is a disabled button that does not open the selector when disabled', async () => {
    const { input, onInputClick } = setup({ disabled: true });

    expect(input).toBeDisabled();
    await userEvent.click(input);
    expect(onInputClick).not.toHaveBeenCalled();
  });
});
