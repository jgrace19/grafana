/* eslint-disable @grafana/i18n/no-untranslated-strings */
import * as stylex from '@stylexjs/stylex';
import { useId, useState } from 'react';
import * as React from 'react';

import {
  colorManipulator,
  FieldColorModeId,
  fieldColorModeRegistry,
  type GrafanaTheme2,
  type ThemeRichColor,
  type ThemeVizHue,
} from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { allButtonVariants, Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { CollapsableSection } from '../Collapse/CollapsableSection';
import { Combobox } from '../Combobox/Combobox';
import { Field } from '../Forms/Field';
import { InlineField } from '../Forms/InlineField';
import { InlineFieldRow } from '../Forms/InlineFieldRow';
import { RadioButtonGroup } from '../Forms/RadioButtonGroup/RadioButtonGroup';
import { Icon } from '../Icon/Icon';
import { Input } from '../Input/Input';
import { type BackgroundColor, type BorderColor, Box, type BoxShadow } from '../Layout/Box/Box';
import { Stack } from '../Layout/Stack/Stack';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';
import { Switch } from '../Switch/Switch';
import { Text, type TextProps } from '../Text/Text';

interface DemoBoxProps {
  bg?: BackgroundColor;
  border?: BorderColor;
  scrollable?: boolean;
  shadow?: BoxShadow;
  textColor?: TextProps['color'];
}

const DemoBox = ({ bg, border, children, shadow, scrollable }: React.PropsWithChildren<DemoBoxProps>) => {
  const MaybeScroll = scrollable ? ScrollContainer : React.Fragment;
  return (
    <Box
      backgroundColor={bg ? bg : undefined}
      padding={2}
      borderStyle={border ? 'solid' : undefined}
      borderColor={border}
      boxShadow={shadow}
      borderRadius={'lg'}
    >
      <MaybeScroll>{children}</MaybeScroll>
    </Box>
  );
};

const DemoText = ({
  color,
  bold,
  children,
}: React.PropsWithChildren<{ color?: TextProps['color']; bold?: boolean; size?: number }>) => {
  return (
    <Box padding={0.5}>
      {children && (
        <Text color={color ? color : undefined} weight={bold ? 'bold' : undefined}>
          {children}
        </Text>
      )}
    </Box>
  );
};

export const ThemeDemo = () => {
  const [radioValue, setRadioValue] = useState('v');
  const [boolValue, setBoolValue] = useState(false);
  const [selectValue, setSelectValue] = useState('Item 2');
  const t = useTheme2();
  const inputId = useId();
  const disabledInputId = useId();
  const comboboxId = useId();
  const radioId = useId();
  const switchId = useId();
  const switchTrueId = useId();
  const switchDisabledId = useId();
  const inlineId = useId();
  const inlineDisabledId = useId();

  const getColors = (mode: FieldColorModeId) => {
    const modeInstance = fieldColorModeRegistry.get(mode);
    if (!modeInstance || !modeInstance.getColors) {
      return [];
    }
    return modeInstance.getColors(t).map((colorName) => t.visualization.getColorByName(colorName));
  };

  const richColors = [
    t.colors.primary,
    t.colors.secondary,
    t.colors.success,
    t.colors.error,
    t.colors.warning,
    t.colors.info,
  ];

  const vizColors = t.visualization.hues;

  const classicPalette = getColors(FieldColorModeId.PaletteClassic);
  const continuousPalettes = [
    getColors(FieldColorModeId.ContinuousGrYlRd),
    getColors(FieldColorModeId.ContinuousBlYlRd),
    getColors(FieldColorModeId.ContinuousYlRd),
    getColors(FieldColorModeId.ContinuousBlPu),
    getColors(FieldColorModeId.ContinuousYlBl),
  ];

  const selectOptions = [
    { label: 'Item 1', value: 'Item 1' },
    { label: 'Item 2', value: 'Item 2' },
    { label: 'Item 3', value: 'Item 3' },
    { label: 'Item 4', value: 'Item 4' },
  ];
  const radioOptions = [
    { value: 'h', label: 'Horizontal' },
    { value: 'v', label: 'Vertical' },
    { value: 'a', label: 'Auto' },
  ];

  return (
    <div {...stylex.props(styles.root)}>
      <DemoBox bg="canvas">
        <CollapsableSection label="Layers" isOpen={true}>
          <DemoText>t.colors.background.canvas</DemoText>
          <DemoBox bg="primary" border="weak">
            <DemoText>t.colors.background.primary is the main & preferred content </DemoText>
            <DemoBox bg="secondary" border="weak">
              <DemoText>t.colors.background.secondary (Used for cards)</DemoText>
            </DemoBox>
            <Box padding={4}>
              <DemoText>t.colors.background.elevated</DemoText>
              <DemoBox bg="elevated" border="weak" shadow="z3">
                This elevated color should be used for menus and popovers.
              </DemoBox>
            </Box>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Text colors" isOpen={true}>
          <Stack justifyContent="flex-start" wrap="wrap">
            <DemoBox>
              <TextColors t={t} />
            </DemoBox>
            <DemoBox bg="primary">
              <TextColors t={t} />
            </DemoBox>
            <DemoBox bg="secondary">
              <TextColors t={t} />
            </DemoBox>
          </Stack>
        </CollapsableSection>
        <CollapsableSection label="Rich colors" isOpen={true}>
          <DemoBox bg="primary" scrollable>
            <table {...stylex.props(styles.colorsTable)}>
              <thead>
                <tr>
                  <td {...stylex.props(styles.td)}>name</td>
                  <td {...stylex.props(styles.td)}>main</td>
                  <td {...stylex.props(styles.td)}>shade (used for hover)</td>
                  <td {...stylex.props(styles.td)}>transparent</td>
                  <td {...stylex.props(styles.td)}>border & text</td>
                </tr>
              </thead>
              <tbody>
                {richColors.map((color) => (
                  <RichColorDemo key={color.name} color={color} theme={t} />
                ))}
              </tbody>
            </table>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Viz hues" isOpen={true}>
          <DemoBox bg="primary" scrollable>
            <table {...stylex.props(styles.colorsTable)}>
              <thead>
                <tr>
                  <td {...stylex.props(styles.td)}>name</td>
                  <td {...stylex.props(styles.td)}>super-light</td>
                  <td {...stylex.props(styles.td)}>light</td>
                  <td {...stylex.props(styles.td)}>primary</td>
                  <td {...stylex.props(styles.td)}>semi-dark</td>
                  <td {...stylex.props(styles.td)}>dark</td>
                </tr>
              </thead>
              <tbody>
                {vizColors.map((color) => (
                  <VizHuesDemo key={color.name} color={color} theme={t} />
                ))}
              </tbody>
            </table>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Palettes" isOpen={true}>
          <DemoBox bg="primary" scrollable>
            <Stack direction="column">
              <Stack gap={0}>
                {classicPalette.map((color) => {
                  return <div style={{ backgroundColor: color, height: '40px', flex: 1 }} key={color} />;
                })}
              </Stack>
              {continuousPalettes.map((palette, index) => (
                <Stack key={index} gap={0}>
                  <div
                    style={{ background: `linear-gradient(90deg, ${palette.join(', ')} )`, height: '40px', flex: 1 }}
                  />
                </Stack>
              ))}
            </Stack>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Forms" isOpen={true}>
          <DemoBox bg="primary">
            <Field label="Input label" description="Field description">
              <Input id={inputId} placeholder="Placeholder" />
            </Field>
            <Field label="Input disabled" disabled>
              <Input id={disabledInputId} placeholder="Placeholder" value="Disabled value" />
            </Field>
            <Field label="Combobox">
              <Combobox
                id={comboboxId}
                options={selectOptions}
                value={selectValue}
                onChange={(v) => setSelectValue(v?.value!)}
              />
            </Field>
            <Field label="Radio label">
              <RadioButtonGroup id={radioId} options={radioOptions} value={radioValue} onChange={setRadioValue} />
            </Field>
            <Stack>
              <Field label="Switch">
                <Switch id={switchId} value={boolValue} onChange={(e) => setBoolValue(e.currentTarget.checked)} />
              </Field>
              <Field label="Switch true">
                <Switch id={switchTrueId} value={true} />
              </Field>
              <Field label="Switch false disabled" disabled={true}>
                <Switch id={switchDisabledId} value={false} />
              </Field>
            </Stack>
            <Stack direction="column">
              <div>Inline forms</div>
              <InlineFieldRow>
                <InlineField label="Label">
                  <Input id={inlineId} placeholder="Placeholder" />
                </InlineField>
                <InlineField label="Another Label" disabled>
                  <Input id={inlineDisabledId} placeholder="Disabled" />
                </InlineField>
              </InlineFieldRow>
            </Stack>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Shadows" isOpen={true}>
          <DemoBox bg="primary">
            <Stack>
              {Object.entries(t.shadows).map(([key, value]) => (
                <ShadowDemo name={key} shadow={value} key={key} />
              ))}
            </Stack>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Buttons" isOpen={true}>
          <DemoBox bg="primary">
            <Stack direction="column" gap={3}>
              <Stack wrap="wrap">
                {allButtonVariants.map((variant) => (
                  <Button variant={variant} key={variant}>
                    {variant}
                  </Button>
                ))}
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </Stack>
              <Card noMargin>
                <Card.Heading>Button inside card</Card.Heading>
                <Card.Actions>
                  {allButtonVariants.map((variant) => (
                    <Button variant={variant} key={variant}>
                      {variant}
                    </Button>
                  ))}
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </Card.Actions>
              </Card>
            </Stack>
          </DemoBox>
        </CollapsableSection>
        <CollapsableSection label="Actions" isOpen={true}>
          <ActionsDemo />
        </CollapsableSection>
      </DemoBox>
    </div>
  );
};

interface VizHuesDemoProps {
  color: ThemeVizHue;
  theme: GrafanaTheme2;
}

export function VizHuesDemo({ color }: VizHuesDemoProps) {
  return (
    <tr>
      <td {...stylex.props(styles.td)}>{color.name}</td>
      {color.shades.map((shade, index) => (
        <td key={index} {...stylex.props(styles.td)}>
          <div
            {...stylex.props(
              styles.swatch,
              styles.colors(
                shade.color,
                colorManipulator.getContrastRatio('#FFFFFF', shade.color) >= 4.5 ? '#FFFFFF' : '#000000'
              )
            )}
          >
            {shade.color}
          </div>
        </td>
      ))}
    </tr>
  );
}

interface RichColorDemoProps {
  theme: GrafanaTheme2;
  color: ThemeRichColor;
}

export function RichColorDemo({ theme, color }: RichColorDemoProps) {
  return (
    <tr>
      <td {...stylex.props(styles.td)}>{color.name}</td>
      <td {...stylex.props(styles.td)}>
        <div {...stylex.props(styles.swatch, styles.colors(color.main, color.contrastText), styles.mainSwatch)}>
          {color.main}
        </div>
      </td>
      <td {...stylex.props(styles.td)}>
        <div
          {...stylex.props(styles.swatch, styles.colors(color.shade, theme.colors.getContrastText(color.shade, 4.5)))}
        >
          {color.shade}
        </div>
      </td>
      <td {...stylex.props(styles.td)}>
        <div {...stylex.props(styles.swatch, styles.background(color.transparent))}>{color.shade}</div>
      </td>
      <td {...stylex.props(styles.td)}>
        <div {...stylex.props(styles.swatch, styles.outlined(color.border, color.text))}>{color.text}</div>
      </td>
    </tr>
  );
}

export function TextColors({ t }: { t: GrafanaTheme2 }) {
  return (
    <>
      <DemoText color="primary">
        text.primary <Icon name="trash-alt" />
      </DemoText>
      <DemoText color="secondary">
        text.secondary <Icon name="trash-alt" />
      </DemoText>
      <DemoText color="disabled">
        text.disabled <Icon name="trash-alt" />
      </DemoText>
      <DemoText color="primary">
        primary.text <Icon name="trash-alt" />
      </DemoText>
    </>
  );
}

export function ShadowDemo({ name, shadow }: { name: string; shadow: string }) {
  return <div {...stylex.props(styles.shadowDemo, styles.shadow(shadow))}>{name}</div>;
}

export function ActionsDemo() {
  const items = (
    <Stack direction="column">
      <div {...stylex.props(styles.item)}>item</div>
      <div {...stylex.props(styles.item)}>item</div>
      <div {...stylex.props(styles.item, styles.itemHover)}>item hover</div>
      <div {...stylex.props(styles.item, styles.itemSelected)}>item selected</div>
      <div {...stylex.props(styles.item, styles.itemFocused)}>item focused</div>
    </Stack>
  );

  return (
    <Stack justifyContent="flex-start">
      <DemoBox bg="canvas">{items}</DemoBox>
      <DemoBox bg="primary">{items}</DemoBox>
      <DemoBox bg="secondary">{items}</DemoBox>
    </Stack>
  );
}

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  root: {
    width: '100%',
    color: colors['--gf-colors-text-primary'],
  },
  colorsTable: {
    textAlign: 'center',
    overflow: 'auto',
  },
  td: {
    padding: grid,
    textAlign: 'center',
  },
  swatch: {
    borderRadius: shape['--gf-shape-radius-default'],
    padding: grid,
  },
  mainSwatch: {
    fontWeight: 500,
  },
  colors: (backgroundColor: string, color: string) => ({
    backgroundColor,
    color,
  }),
  background: (backgroundColor: string) => ({
    backgroundColor,
  }),
  outlined: (borderColor: string, color: string) => ({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor,
    color,
  }),
  shadowDemo: {
    padding: `calc(${grid} * 2)`,
    borderRadius: shape['--gf-shape-radius-default'],
  },
  shadow: (boxShadow: string) => ({
    boxShadow,
  }),
  item: {
    borderRadius: shape['--gf-shape-radius-default'],
    padding: grid,
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
  },
  itemHover: {
    backgroundColor: colors['--gf-colors-action-hover'],
  },
  itemSelected: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
  },
  itemFocused: {
    backgroundColor: { default: colors['--gf-colors-action-focus'], ':hover': colors['--gf-colors-action-hover'] },
  },
});
