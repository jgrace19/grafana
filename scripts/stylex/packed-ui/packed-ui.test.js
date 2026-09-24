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
    expect(screen.getByPlaceholderText('Name')).toBeTruthy();
  });

  it('ships stylex.css with the rules the compiled classes use', () => {
    const cssPath = require.resolve('@grafana/ui/stylex.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    render(withTheme(React.createElement(ui.Button, null, 'Apply')));
    const classes = screen.getByRole('button', { name: 'Apply' }).className.split(/\s+/);

    expect(css).toContain('@layer grafana-legacy, grafana-global, stylex.priority1');
    expect(css).toContain('--gf-colors-primary-main');
    for (const className of classes) {
      expect(css).toContain(`.${className}`);
    }
  });
});
