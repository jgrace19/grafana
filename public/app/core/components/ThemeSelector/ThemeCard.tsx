import * as stylex from '@stylexjs/stylex';

import { FeatureState, type GrafanaTheme2, type ThemeRegistryItem } from '@grafana/data';
import { t } from '@grafana/i18n';
import { FeatureBadge, RadioButtonDot } from '@grafana/ui';

import { ThemePreview } from '../Theme/ThemePreview';

interface ThemeCardProps {
  themeOption: ThemeRegistryItem;
  isExperimental?: boolean;
  isSelected?: boolean;
  onSelect: () => void;
}

export function ThemeCard({ themeOption, isExperimental, isSelected, onSelect }: ThemeCardProps) {
  const theme = themeOption.build();
  const label = getTranslatedThemeName(themeOption);

  return (
    // this is a convenience for mouse users. keyboard/screen reader users will use the radio button
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div {...stylex.props(themeCardStyles.card)} onClick={onSelect}>
      <div {...stylex.props(themeCardStyles.header)}>
        <RadioButtonDot
          id={`theme-${theme.name}`}
          name={'theme'}
          label={label}
          onClick={(event) => {
            // prevent propagation so that onSelect is only called once when clicking the radio button
            event.stopPropagation();
          }}
          onChange={onSelect}
          checked={isSelected}
        />
        {isExperimental && <FeatureBadge featureState={FeatureState.experimental} />}
      </div>
      <ThemePreview theme={theme} />
    </div>
  );
}


function getTranslatedThemeName(theme: ThemeRegistryItem) {
  switch (theme.id) {
    case 'dark':
      return t('shared.preferences.theme.dark-label', 'Dark');
    case 'light':
      return t('shared.preferences.theme.light-label', 'Light');
    case 'system':
      return t('shared.preferences.theme.system-label', 'System preference');
    default:
      return theme.name;
  }
}
