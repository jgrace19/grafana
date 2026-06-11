import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';

import { FeatureState } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import {
  Button,
  Field,
  FieldSet,
  Label,
  TimeZonePicker,
  WeekStartPicker,
  FeatureBadge,
  Combobox,
  type ComboboxOption,
  TextLink,
  type WeekStart,
  isWeekStart,
} from '@grafana/ui';
import { DashboardPicker } from 'app/core/components/Select/DashboardPicker';
import { PreferencesService } from 'app/core/services/PreferencesService';
import { changeTheme } from 'app/core/services/theme';

import { getSelectableThemes } from '../ThemeSelector/getSelectableThemes';

import {
  getLanguageOptions,
  getRegionalFormatOptions,
  getStyles,
  getTranslatedThemeName,
  type Props,
} from './utils';

function SharedPreferences({ resourceUri, onConfirm, preferenceType, disabled }: Props) {
  const service = useMemo(() => new PreferencesService(resourceUri), [resourceUri]);

  const themeOptions = useMemo(() => {
    const themes = getSelectableThemes();
    const options: ComboboxOption[] = themes.map((theme) => ({
      value: theme.id,
      label: getTranslatedThemeName(theme),
      group: theme.isExtra ? t('shared-preferences.theme.experimental', 'Experimental') : undefined,
    }));
    options.unshift({ value: '', label: t('shared-preferences.theme.default-label', 'Default') });
    return options;
  }, []);

  const languageOptions = useMemo(() => getLanguageOptions(), []);
  const regionalFormatOptions = useMemo(() => getRegionalFormatOptions(), []);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState('');
  const [timezone, setTimezone] = useState('');
  const [weekStart, setWeekStart] = useState('');
  const [language, setLanguage] = useState('');
  const [regionalFormat, setRegionalFormat] = useState('');
  const [homeDashboardUID, setHomeDashboardUID] = useState<string | undefined>(undefined);
  const [queryHistory, setQueryHistory] = useState<{ homeTab: string }>({ homeTab: '' });
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [navbar, setNavbar] = useState<{ bookmarkUrls: string[] }>({ bookmarkUrls: [] as string[] });

  useEffect(() => {
    setIsLoading(true);
    service.load().then((prefs) => {
      setIsLoading(false);
      setHomeDashboardUID(prefs.homeDashboardUID);
      setTheme(prefs.theme ?? '');
      setTimezone(prefs.timezone ?? '');
      setWeekStart(prefs.weekStart ?? '');
      setLanguage(prefs.language ?? '');
      setRegionalFormat(prefs.regionalFormat ?? '');
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      setQueryHistory((prefs.queryHistory as { homeTab: string }) ?? { homeTab: '' });
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      setNavbar((prefs.navbar as { bookmarkUrls: string[] }) ?? { bookmarkUrls: [] });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const confirmationResult = onConfirm ? await onConfirm() : true;

    if (confirmationResult) {
      reportInteraction('grafana_preferences_save_button_clicked', {
        preferenceType,
        theme,
        language,
      });
      setIsSubmitting(true);
      await service
        .update({
          homeDashboardUID,
          theme,
          timezone,
          weekStart,
          language,
          regionalFormat,
          queryHistory,
          navbar,
        })
        .finally(() => {
          setIsSubmitting(false);
        });
      window.location.reload();
    }
  };

  const onThemeChanged = (value: ComboboxOption<string>) => {
    setTheme(value.value);
    reportInteraction('grafana_preferences_theme_changed', {
      toTheme: value.value,
      preferenceType,
    });

    if (value.value) {
      changeTheme(value.value, true);
    }
  };

  const onTimeZoneChanged = (tz?: string) => {
    if (typeof tz !== 'string') {
      return;
    }
    setTimezone(tz);
  };

  const onWeekStartChanged = (ws?: WeekStart) => {
    setWeekStart(ws ?? '');
  };

  const onHomeDashboardChanged = (dashboardUID: string) => {
    setHomeDashboardUID(dashboardUID);
  };

  const onLanguageChanged = (lang: string) => {
    setLanguage(lang);

    reportInteraction('grafana_preferences_language_changed', {
      toLanguage: lang,
      preferenceType,
    });
  };

  const onLocaleChanged = (rf: string) => {
    setRegionalFormat(rf);

    reportInteraction('grafana_preferences_regional_format_changed', {
      toRegionalFormat: rf,
      preferenceType,
    });
  };

  const styles = getStyles();
  const currentThemeOption = themeOptions.find((x) => x.value === theme) ?? themeOptions[0];

  return (
    <form onSubmit={onSubmitForm} className={styles.form}>
      <FieldSet label={<Trans i18nKey="shared-preferences.title">Preferences</Trans>} disabled={disabled}>
        <Field
          loading={isLoading}
          disabled={isLoading}
          label={t('shared-preferences.fields.theme-label', 'Interface theme')}
          description={
            config.featureToggles.grafanaconThemes && config.feedbackLinksEnabled ? (
              <Trans i18nKey="shared-preferences.fields.theme-description">
                Enjoying the experimental themes? Tell us what you'd like to see{' '}
                <TextLink
                  variant="bodySmall"
                  external
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeRKAY8nUMEVIKSYJ99uOO-dimF6Y69_If1Q1jTLOZRWqK1cw/viewform?usp=dialog"
                >
                  here.
                </TextLink>
              </Trans>
            ) : undefined
          }
        >
          <Combobox
            options={themeOptions}
            value={currentThemeOption.value}
            onChange={onThemeChanged}
            id="shared-preferences-theme-select"
          />
        </Field>

        <Field
          loading={isLoading}
          disabled={isLoading}
          label={
            <Label htmlFor="home-dashboard-select">
              <span className={styles.labelText}>
                <Trans i18nKey="shared-preferences.fields.home-dashboard-label">Home Dashboard</Trans>
              </span>
            </Label>
          }
          data-testid="User preferences home dashboard drop down"
        >
          <DashboardPicker
            value={homeDashboardUID}
            onChange={(v) => onHomeDashboardChanged(v?.uid ?? '')}
            defaultOptions={true}
            isClearable={true}
            placeholder={t('shared-preferences.fields.home-dashboard-placeholder', 'Default dashboard')}
            inputId="home-dashboard-select"
          />
        </Field>

        <Field
          loading={isLoading}
          disabled={isLoading}
          label={t('shared-dashboard.fields.timezone-label', 'Timezone')}
          data-testid={selectors.components.TimeZonePicker.containerV2}
        >
          <TimeZonePicker
            includeInternal={true}
            value={timezone}
            onChange={onTimeZoneChanged}
            inputId="shared-preferences-timezone-picker"
          />
        </Field>

        <Field
          loading={isLoading}
          disabled={isLoading}
          label={t('shared-preferences.fields.week-start-label', 'Week start')}
          data-testid={selectors.components.WeekStartPicker.containerV2}
        >
          <WeekStartPicker
            value={weekStart && isWeekStart(weekStart) ? weekStart : undefined}
            onChange={onWeekStartChanged}
            inputId="shared-preferences-week-start-picker"
          />
        </Field>

        <Field
          loading={isLoading}
          disabled={isLoading}
          label={
            <Label htmlFor="language-preference-select">
              <span className={styles.labelText}>
                <Trans i18nKey="shared-preferences.fields.language-preference-label">Language</Trans>
              </span>
              <FeatureBadge featureState={FeatureState.preview} />
            </Label>
          }
          data-testid="User preferences language drop down"
        >
          <Combobox
            value={languageOptions.find((lang) => lang.value === language)?.value || ''}
            onChange={(lang: ComboboxOption | null) => onLanguageChanged(lang?.value ?? '')}
            options={languageOptions}
            placeholder={t('shared-preferences.fields.language-preference-placeholder', 'Choose language')}
            id="language-preference-select"
          />
        </Field>
        {config.featureToggles.localeFormatPreference && (
          <Field
            loading={isLoading}
            disabled={isLoading}
            label={
              <Label htmlFor="locale-preference">
                <span className={styles.labelText}>
                  <Trans i18nKey="shared-preferences.fields.locale-preference-label">Region format</Trans>
                </span>
                <FeatureBadge featureState={FeatureState.preview} />
              </Label>
            }
            description={t(
              'shared-preferences.fields.locale-preference-description',
              'Choose your region to see the corresponding date, time, and number format'
            )}
            data-testid="User preferences locale drop down"
          >
            <Combobox
              value={regionalFormatOptions.find((loc) => loc.value === regionalFormat)?.value || ''}
              onChange={(locale: ComboboxOption | null) => onLocaleChanged(locale?.value ?? '')}
              options={regionalFormatOptions}
              placeholder={t('shared-preferences.fields.locale-preference-placeholder', 'Choose region')}
              id="locale-preference-select"
            />
          </Field>
        )}
      </FieldSet>
      <Button
        disabled={isSubmitting}
        type="submit"
        variant="primary"
        data-testid={selectors.components.UserProfile.preferencesSaveButton}
      >
        <Trans i18nKey="shared-preferences.save">Save preferences</Trans>
      </Button>
    </form>
  );
}

export default SharedPreferences;
