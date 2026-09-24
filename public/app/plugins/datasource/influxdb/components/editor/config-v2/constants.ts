import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { AuthMethod } from '@grafana/plugin-ui';
import { type ComboboxOption } from '@grafana/ui';
import { colors, components, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export const RADIO_BUTTON_OPTIONS = [
  { label: 'Enabled', value: true },
  { label: 'Disabled', value: false },
];

export const AUTH_RADIO_BUTTON_OPTIONS = [
  { label: 'No Authentication', value: AuthMethod.NoAuth },
  { label: 'Basic Authentication', value: AuthMethod.BasicAuth },
  { label: 'Forward OAuth Identity', value: AuthMethod.OAuthForward },
];

export const CONFIG_SECTION_HEADERS = [
  { label: 'URL and authentication', id: 'url', isOpen: true, isOptional: false },
  { label: 'Database settings', id: 'db', isOpen: true, isOptional: false },
  { label: 'Save & test', id: `${selectors.pages.DataSource.saveAndTest}`, isOpen: true, isOptional: null },
];

export const CONFIG_SECTION_HEADERS_WITH_PDC = [
  { label: 'URL and authentication', id: 'url', isOpen: true, isOptional: false },
  { label: 'Database settings', id: 'db', isOpen: true, isOptional: false },
  { label: 'Private data source connect', id: 'pdc', isOpen: false, isOptional: true },
  { label: 'Save & test', id: `${selectors.pages.DataSource.saveAndTest}`, isOpen: true, isOptional: null },
];

export const HTTP_MODES: ComboboxOption[] = [
  { label: 'POST', value: 'POST' },
  { label: 'GET', value: 'GET' },
];

export const CONTAINER_MIN_WIDTH = '450px';
export const DB_SETTINGS_LABEL_WIDTH = 22;

const inputHeight = `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`;

export const inlineLabelStyles = stylex.create({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-md'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    height: inputHeight,
    lineHeight: inputHeight,
    marginRight: spacing['--gf-spacing-x0-5'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderStyle: 'none',
    width: '220px',
    color: colors['--gf-colors-text-primary'],
  },
});
