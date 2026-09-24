/* eslint-disable */
// Runs against the packed @grafana/ui (see run.sh). Plain CommonJS so the scratch project needs no transform.
const fs = require('fs');
const path = require('path');
const React = require('react');
const { render, screen } = require('@testing-library/react');

const ui = require('@grafana/ui');
const { createTheme, ThemeContext } = require('@grafana/data');

const withTheme = (element) => React.createElement(ThemeContext.Provider, { value: createTheme() }, element);

describe('packed @grafana/ui', () => {
  let consoleError;
  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error');
  });
  afterEach(() => {
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('resolves the CommonJS dist, not the source', () => {
    expect(require.resolve('@grafana/ui')).toMatch(/node_modules\/@grafana\/ui\/dist\/cjs\/index\.cjs$/);
  });

  it('renders a StyleX Button without the StyleX Babel plugin', () => {
    render(withTheme(React.createElement(ui.Button, { variant: 'secondary' }, 'Save')));
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toMatch(/\bx[a-z0-9]+\b/);
  });

  it('renders Input and Stack alongside it', () => {
    render(
      withTheme(React.createElement(ui.Stack, { gap: 2 }, React.createElement(ui.Input, { placeholder: 'Name' })))
    );
    const input = screen.getByPlaceholderText('Name');
    expect(input.closest('[class]').parentElement.className).not.toMatch(/undefined|NaN/);
  });

  it('ships stylex.css with the rules the compiled classes use', () => {
    // Resolved by hand: Jest's moduleNameMapper stubs `*.css` even for require.resolve.
    const pkgDir = path.dirname(require.resolve('@grafana/ui/package.json'));
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
    expect(pkg.exports['./stylex.css']).toBe('./dist/stylex.css');
    const css = fs.readFileSync(path.join(pkgDir, pkg.exports['./stylex.css']), 'utf8');
    render(withTheme(React.createElement(ui.Button, null, 'Apply')));
    const classes = screen.getByRole('button', { name: 'Apply' }).className.split(/\s+/);

    expect(css).toContain('@layer grafana-legacy, grafana-global, stylex.priority1');
    expect(css).toContain('--gf-colors-primary-main');
    for (const className of classes) {
      expect(css).toContain(`.${className}`);
    }
  });
});
