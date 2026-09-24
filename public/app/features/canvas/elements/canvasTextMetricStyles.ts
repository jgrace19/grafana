import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { type TextData } from '../types';

import { canvasTextMetricStyles } from './canvasTextMetric.stylex';

const cn = (key: keyof typeof canvasTextMetricStyles) =>
  mergeStylexClassName(stylex.props(canvasTextMetricStyles[key]), undefined).className ?? '';

export const getCanvasTextMetricStyles = (_data: TextData | undefined) => (_theme: GrafanaTheme2) => {
  const data = _data;
  return {
    container: cn('container'),
    inlineEditorContainer: cn('inlineEditorContainer'),
    span:
      mergeStylexClassName(
        stylex.props(canvasTextMetricStyles.span, {
          verticalAlign: data?.valign,
          textAlign: data?.align,
          fontSize: data?.size ? `${data.size}px` : undefined,
          color: data?.color,
        }),
        undefined
      ).className ?? '',
  };
};
