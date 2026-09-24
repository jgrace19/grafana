import { type Meta, type StoryFn } from '@storybook/react';

import { getThemeById } from '@grafana/data';

import { StyleXThemeFixture } from '../../utils/storybook/fixtures/StyleXThemeFixture';

import { getThemeCssVariables } from './cssVariables';

const meta: Meta = {
  title: 'Foundations/StyleX theme bridge',
  component: StyleXThemeFixture,
  tags: ['!autodocs'],
  parameters: {
    options: {
      showPanel: false,
    },
  },
};

export const Basic: StoryFn = () => <StyleXThemeFixture />;

/** The same StyleX classes resolve differently inside a subtree that re-declares the variables for another theme. */
export const ScopedThemes: StoryFn = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    {['dark', 'light'].map((themeId) => (
      <div key={themeId} style={getThemeCssVariables(getThemeById(themeId))}>
        <StyleXThemeFixture title={`StyleX theme bridge (${themeId})`} />
      </div>
    ))}
  </div>
);

export default meta;
