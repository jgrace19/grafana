import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { rectangleStyles } from './rectangle.stylex';
import { memo } from 'react';

import { t } from '@grafana/i18n';
import { type DimensionContext } from 'app/features/dimensions/context';
import { ColorDimensionEditor } from 'app/features/dimensions/editors/ColorDimensionEditor';
import { TextDimensionEditor } from 'app/features/dimensions/editors/TextDimensionEditor';

import {
  type CanvasElementItem,
  type CanvasElementOptions,
  type CanvasElementProps,
  defaultBgColor,
  defaultTextColor,
} from '../element';
import { Align, type TextConfig, type TextData, VAlign } from '../types';

const RectangleDisplay = memo<CanvasElementProps<TextConfig, TextData>>(({ data }) => {
  const styles = (getStyles, data);

  return (
    <div {...stylex.props(rectangleStyles.container)}>
      <span {...stylex.props(rectangleStyles.span)}>{data?.text}</span>
    </div>
  );
});

RectangleDisplay.displayName = 'RectangleDisplay';


export const rectangleItem: CanvasElementItem<TextConfig, TextData> = {
  id: 'rectangle',
  name: 'Rectangle',
  description: 'Rectangle',

  display: RectangleDisplay,

  defaultSize: {
    width: 240,
    height: 160,
  },

  getNewOptions: (options) => ({
    ...options,
    config: {
      align: Align.Center,
      valign: VAlign.Middle,
      color: {
        fixed: defaultTextColor,
      },
    },
    background: {
      color: {
        fixed: defaultBgColor,
      },
    },
    links: options?.links ?? [],
  }),

  // Called when data changes
  prepareData: (dimensionContext: DimensionContext, elementOptions: CanvasElementOptions<TextConfig>) => {
    const textConfig = elementOptions.config;

    const data: TextData = {
      text: textConfig?.text ? dimensionContext.getText(textConfig.text).value() : '',
      field: textConfig?.text?.field,
      align: textConfig?.align ?? Align.Center,
      valign: textConfig?.valign ?? VAlign.Middle,
      size: textConfig?.size,
    };

    if (textConfig?.color) {
      data.color = dimensionContext.getColor(textConfig.color).value();
    }

    return data;
  },

  // Heatmap overlay options
  registerOptionsUI: (builder) => {
    const category = [t('canvas.rectangle-item.category-rectangle', 'Rectangle')];
    builder
      .addCustomEditor({
        category,
        id: 'textSelector',
        path: 'config.text',
        name: t('canvas.rectangle-item.name-text', 'Text'),
        editor: TextDimensionEditor,
      })
      .addCustomEditor({
        category,
        id: 'config.color',
        path: 'config.color',
        name: t('canvas.rectangle-item.name-text-color', 'Text color'),
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {},
      })
      .addRadio({
        category,
        path: 'config.align',
        name: t('canvas.rectangle-item.name-align-text', 'Align text'),
        settings: {
          options: [
            { value: Align.Left, label: t('canvas.rectangle-item.label.left', 'Left') },
            { value: Align.Center, label: t('canvas.rectangle-item.label.center', 'Center') },
            { value: Align.Right, label: t('canvas.rectangle-item.label.right', 'Right') },
          ],
        },
        defaultValue: Align.Left,
      })
      .addRadio({
        category,
        path: 'config.valign',
        name: t('canvas.rectangle-item.name-vertical-align', 'Vertical align'),
        settings: {
          options: [
            { value: VAlign.Top, label: t('canvas.rectangle-item.label.top', 'Top') },
            { value: VAlign.Middle, label: t('canvas.rectangle-item.label.middle', 'Middle') },
            { value: VAlign.Bottom, label: t('canvas.rectangle-item.label.bottom', 'Bottom') },
          ],
        },
        defaultValue: VAlign.Middle,
      })
      .addNumberInput({
        category,
        path: 'config.size',
        name: t('canvas.rectangle-item.name-text-size', 'Text size'),
        settings: {
          placeholder: t('canvas.rectangle-item.placeholder.auto', 'Auto'),
        },
      });
  },
};
