import * as stylex from '@stylexjs/stylex';

import { FeatureState, type ThemeRegistryItem } from '@grafana/data';
import { t } from '@grafana/i18n';
import { FeatureBadge, RadioButtonDot } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { ThemePreview } from '../Theme/ThemePreview';

import './ThemeCard.css';

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
    <div {...stylex.props(styles.card)} onClick={onSelect}>
      <div className={`gf-theme-card-header ${stylex.props(styles.header).className}`}>
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

const styles = stylex.create({
  card: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: { default: colors['--gf-colors-border-weak'], ':hover': colors['--gf-colors-border-medium'] },
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
});

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
