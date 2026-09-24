import * as stylex from '@stylexjs/stylex';
import { useCallback, useId, useState } from 'react';
import * as React from 'react';

import { getTimeZoneInfo, type TimeZone } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t, Trans } from '@grafana/i18n';

import { colors, spacing } from '../../../themes/stylex/tokens.stylex';
import { Button } from '../../Button/Button';
import { Combobox } from '../../Combobox/Combobox';
import { Field } from '../../Forms/Field';
import { Tab } from '../../Tabs/Tab';
import { TabContent } from '../../Tabs/TabContent';
import { TabsBar } from '../../Tabs/TabsBar';
import { TimeZonePicker } from '../TimeZonePicker';
import { TimeZoneDescription } from '../TimeZonePicker/TimeZoneDescription';
import { TimeZoneOffset } from '../TimeZonePicker/TimeZoneOffset';
import { TimeZoneTitle } from '../TimeZonePicker/TimeZoneTitle';
import { getMonthOptions } from '../options';

interface Props {
  timeZone?: TimeZone;
  fiscalYearStartMonth?: number;
  timestamp?: number;
  onChangeTimeZone: (timeZone: TimeZone) => void;
  onChangeFiscalYearStartMonth?: (month: number) => void;
}

export const TimePickerFooter = (props: Props) => {
  const {
    timeZone,
    fiscalYearStartMonth,
    timestamp = Date.now(),
    onChangeTimeZone,
    onChangeFiscalYearStartMonth,
  } = props;
  const [isEditing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState('tz');

  const timeSettingsId = useId();
  const timeZoneSettingsId = useId();
  const fiscalYearSettingsId = useId();
  const fiscalYearStartMonthId = useId();

  const onToggleChangeTimeSettings = useCallback(
    (event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }
      setEditing(!isEditing);
    },
    [isEditing, setEditing]
  );

  if (typeof timeZone !== 'string') {
    return null;
  }

  const info = getTimeZoneInfo(timeZone, timestamp);

  if (!info) {
    return null;
  }

  return (
    <div>
      <section
        aria-label={t('time-picker.footer.time-zone-selection', 'Time zone selection')}
        {...stylex.props(styles.container)}
      >
        <div {...stylex.props(styles.timeZoneContainer)}>
          <div {...stylex.props(styles.timeZone)}>
            <TimeZoneTitle title={info.name} />
            <div {...stylex.props(styles.spacer)} />
            <TimeZoneDescription info={info} />
          </div>
          <TimeZoneOffset timeZone={timeZone} timestamp={timestamp} />
        </div>
        <div {...stylex.props(styles.spacer)} />
        <Button
          data-testid={selectors.components.TimeZonePicker.changeTimeSettingsButton}
          variant="secondary"
          onClick={onToggleChangeTimeSettings}
          size="sm"
          aria-expanded={isEditing}
          aria-controls={timeSettingsId}
          icon={isEditing ? 'angle-up' : 'angle-down'}
        >
          <Trans i18nKey="time-picker.footer.change-settings-button">Change time settings</Trans>
        </Button>
      </section>
      {isEditing ? (
        <div {...stylex.props(styles.editContainer)} id={timeSettingsId}>
          <TabsBar>
            <Tab
              label={t('time-picker.footer.time-zone-option', 'Time zone')}
              active={editMode === 'tz'}
              onChangeTab={() => {
                setEditMode('tz');
              }}
              aria-controls={timeZoneSettingsId}
            />
            <Tab
              label={t('time-picker.footer.fiscal-year-option', 'Fiscal year')}
              active={editMode === 'fy'}
              onChangeTab={() => {
                setEditMode('fy');
              }}
              aria-controls={fiscalYearSettingsId}
            />
          </TabsBar>
          <TabContent xstyle={styles.tabContent}>
            {editMode === 'tz' ? (
              <section
                role="tabpanel"
                data-testid={selectors.components.TimeZonePicker.containerV2}
                id={timeZoneSettingsId}
                {...stylex.props(styles.timeZoneContainer, styles.timeSettingContainer)}
              >
                <TimeZonePicker
                  includeInternal={true}
                  onChange={(timeZone) => {
                    onToggleChangeTimeSettings();

                    if (typeof timeZone === 'string') {
                      onChangeTimeZone(timeZone);
                    }
                  }}
                  onBlur={onToggleChangeTimeSettings}
                  menuShouldPortal={false}
                />
              </section>
            ) : (
              <section
                role="tabpanel"
                data-testid={selectors.components.TimeZonePicker.containerV2}
                id={fiscalYearSettingsId}
                {...stylex.props(styles.timeZoneContainer, styles.timeSettingContainer)}
              >
                <Field noMargin label={t('time-picker.footer.fiscal-year-start', 'Fiscal year start month')}>
                  <Combobox
                    id={fiscalYearStartMonthId}
                    value={fiscalYearStartMonth ?? null}
                    options={getMonthOptions()}
                    onChange={(value) => {
                      if (onChangeFiscalYearStartMonth) {
                        onChangeFiscalYearStartMonth(value?.value ?? 0);
                      }
                    }}
                  />
                </Field>
              </section>
            )}
          </TabContent>
        </div>
      ) : null}
    </div>
  );
};

const styles = stylex.create({
  tabContent: {
    backgroundColor: 'inherit',
    backgroundImage: 'inherit',
  },
  container: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editContainer: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacer: {
    marginLeft: '7px',
  },
  timeSettingContainer: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  timeZoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  timeZone: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    flexGrow: 1,
  },
});
