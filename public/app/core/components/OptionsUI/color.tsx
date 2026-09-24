import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { useTheme2, ColorPicker, IconButton } from '@grafana/ui';
import { ColorSwatch } from '@grafana/ui/internal';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
          <div {...stylex.props(styles.spot)}>
            <div {...stylex.props(styles.colorPicker)}>
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
                  <span {...stylex.props(styles.colorText)} onClick={showColorPicker}>
                    {value}
                  </span>
                ) : (
                  // TODO: fix keyboard a11y
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <span {...stylex.props(styles.placeholderText)} onClick={showColorPicker}>
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

const styles = stylex.create({
  spot: {
    cursor: 'pointer',
    color: colors['--gf-colors-text-primary'],
    backgroundColor: components['--gf-components-input-background'],
    borderRadius: shape['--gf-shape-radius-default'],
    padding: '3px',
    // theme.v1.spacing.formInputHeight
    height: spacing['--gf-spacing-x4'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': components['--gf-components-input-border-hover'],
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-end',
  },
  colorPicker: {
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  colorText: {
    flexGrow: 2,
  },
  placeholderText: {
    flexGrow: 2,
    color: colors['--gf-colors-text-secondary'],
  },
});
