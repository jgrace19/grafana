import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { useTheme2, ColorPicker, IconButton } from '@grafana/ui';
import { ColorSwatch } from '@grafana/ui/internal';

export interface ColorValueEditorSettings {
  placeholder?: string;
  /** defaults to true */
  enableNamedColors?: boolean;
  /** defaults to false */
  isClearable?: boolean;
}

interface Props {
  id?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  settings?: ColorValueEditorSettings;

  // Will show placeholder or details
  details?: boolean;
}

/**
 * @alpha
 * */
export const ColorValueEditor = ({ value, settings, onChange, details, id }: Props) => {
  const theme = useTheme2();

  return (
    <ColorPicker color={value ?? ''} onChange={onChange} enableNamedColors={settings?.enableNamedColors !== false}>
      {({ ref, showColorPicker, hideColorPicker }) => {
        return (
          <div {...stylex.props(colorStyles.spot)}>
            <div {...stylex.props(colorStyles.colorPicker)}>
              <ColorSwatch
                ref={ref}
                id={id}
                onClick={showColorPicker}
                onMouseLeave={hideColorPicker}
                color={value ? theme.visualization.getColorByName(value) : theme.components.input.borderColor}
              />
            </div>
            {details && (
              <>
                {value ? (
                  // TODO: fix keyboard a11y
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <span {...stylex.props(colorStyles.colorText)} onClick={showColorPicker}>
                    {value}
                  </span>
                ) : (
                  // TODO: fix keyboard a11y
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <span {...stylex.props(colorStyles.placeholderText)} onClick={showColorPicker}>
                    {settings?.placeholder ?? 'Select color'}
                  </span>
                )}
                {settings?.isClearable && value && (
                  <IconButton
                    name="times"
                    onClick={() => onChange(undefined)}
                    tooltip={t('options-ui.color.clear-tooltip', 'Clear settings')}
                  />
                )}
              </>
            )}
          </div>
        );
      }}
    </ColorPicker>
  );
};

