import { FocusScope } from '@react-aria/focus';
import * as stylex from '@stylexjs/stylex';
import { type ComponentType, createElement, useState } from 'react';

import { colorManipulator } from '@grafana/data';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { colors, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { Tab } from '../Tabs/Tab';
import { TabsBar } from '../Tabs/TabsBar';
import { type PopoverContentProps } from '../Tooltip/types';

import { NamedColorsPalette } from './NamedColorsPalette';
import SpectrumPalette from './SpectrumPalette';

export type ColorPickerChangeHandler = (color: string) => void;

export interface ColorPickerProps {
  color: string;
  onChange: ColorPickerChangeHandler;
  enableNamedColors?: boolean;
  id?: string;
}

export interface Props<T> extends ColorPickerProps, PopoverContentProps {
  customPickers?: T;
}

export interface CustomPickersDescriptor {
  [key: string]: {
    tabComponent: ComponentType<ColorPickerProps>;
    name: string;
  };
}

type PickerType = 'palette' | 'spectrum';

export const ColorPickerPopover = <T extends CustomPickersDescriptor>(props: Props<T>) => {
  const { color, onChange, enableNamedColors, customPickers } = props;
  const theme = useTheme2();
  const [activePicker, setActivePicker] = useState<PickerType | keyof T>('palette');

  const handleChange = (color: string) => {
    if (enableNamedColors) {
      return onChange(color);
    }
    onChange(colorManipulator.asHexString(theme.visualization.getColorByName(color)));
  };

  const onTabChange = (tab: PickerType | keyof T) => {
    return () => setActivePicker(tab);
  };

  const renderCustomPicker = (tabKey: keyof T) => {
    if (!customPickers) {
      return null;
    }

    return createElement(customPickers[tabKey].tabComponent, {
      color,
      onChange: handleChange,
    });
  };

  const renderPicker = () => {
    switch (activePicker) {
      case 'spectrum':
        return <SpectrumPalette color={color} onChange={handleChange} />;
      case 'palette':
        return <NamedColorsPalette color={color} onChange={handleChange} />;
      default:
        return renderCustomPicker(activePicker);
    }
  };

  const renderCustomPickerTabs = () => {
    if (!customPickers) {
      return null;
    }

    return (
      <>
        {Object.keys(customPickers).map((key) => {
          return <Tab label={customPickers[key].name} onChangeTab={onTabChange(key)} key={key} />;
        })}
      </>
    );
  };

  return (
    <FocusScope contain restoreFocus autoFocus>
      {/*
        tabIndex=-1 is needed here to support highlighting text within the picker when using FocusScope
        see https://github.com/adobe/react-spectrum/issues/1604#issuecomment-781574668
      */}
      <div tabIndex={-1} {...stylex.props(styles.colorPickerPopover)}>
        <TabsBar>
          <Tab
            label={t('grafana-ui.color-picker-popover.palette-tab', 'Colors')}
            onChangeTab={onTabChange('palette')}
            active={activePicker === 'palette'}
          />
          <Tab
            label={t('grafana-ui.color-picker-popover.spectrum-tab', 'Custom')}
            onChangeTab={onTabChange('spectrum')}
            active={activePicker === 'spectrum'}
          />
          {renderCustomPickerTabs()}
        </TabsBar>
        <div {...stylex.props(styles.colorPickerPopoverContent)}>{renderPicker()}</div>
      </div>
    </FocusScope>
  );
};

const styles = stylex.create({
  colorPickerPopover: {
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z3'],
    backgroundColor: colors['--gf-colors-background-elevated'],
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
  },
  colorPickerPopoverContent: {
    width: '246px',
    fontSize: typography['--gf-typography-body-small-font-size'],
    minHeight: '184px',
    height: '290px',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    display: 'flex',
    flexDirection: 'column',
  },
});
