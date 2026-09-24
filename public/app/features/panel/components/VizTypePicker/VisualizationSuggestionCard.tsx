import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { visualizationSuggestionCardStyles } from './VisualizationSuggestionCard.stylex';
import { cloneDeep } from 'lodash';
import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Tooltip } from '@grafana/ui';

import { PanelRenderer } from '../PanelRenderer';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  data: PanelData;
  width: number;
  suggestion: PanelPluginVisualizationSuggestion;
  isSelected?: boolean;
}

export function VisualizationSuggestionCard({ data, suggestion, width, className, isSelected, ...restProps }: Props) {
  const { innerStyles, outerStyles, renderWidth, renderHeight } = getPreviewDimensionsAndStyles(width);
  const cardOptions = suggestion.cardOptions ?? {};

  const commonButtonProps = {
    'aria-label': suggestion.name,
    className: cx(className, visualizationSuggestionCardStyles.vizBox, isSelected && visualizationSuggestionCardStyles.selected),
    'data-testid': selectors.components.VisualizationPreview.card(suggestion.name),
    style: outerStyles,
    ...restProps,
  } satisfies HTMLAttributes<HTMLDivElement> & { 'data-testid': string };

  let content: ReactNode;

  if (cardOptions.imgSrc) {
    content = (
      <div {...commonButtonProps} {...mergeStylexClassName(stylex.props(visualizationSuggestionCardStyles.imgBox, commonButtonProps.className, ), undefined)}>
        <div {...stylex.props(visualizationSuggestionCardStyles.name)}>{suggestion.name}</div>
        <img {...stylex.props(visualizationSuggestionCardStyles.img)} src={cardOptions.imgSrc} alt={suggestion.name} />
      </div>
    );
  } else {
    let preview = suggestion;
    if (suggestion.cardOptions?.previewModifier) {
      preview = cloneDeep(suggestion);
      suggestion.cardOptions.previewModifier(preview);
    }

    const maxSeries = cardOptions.maxSeries;
    const maxRows = cardOptions.maxRows;
    let previewData = maxSeries ? { ...data, series: data.series.slice(0, maxSeries) } : data;

    if (maxRows && previewData.series.some((frame) => frame.length > maxRows)) {
      previewData = {
        ...previewData,
        series: previewData.series.map((frame) =>
          frame.length > maxRows
            ? {
                ...frame,
                length: maxRows,
                fields: frame.fields.map((field) => ({ ...field, values: field.values.slice(0, maxRows) })),
              }
            : frame
        ),
      };
    }

    content = (
      <div {...commonButtonProps}>
        {/* to use inert in React 18, we have to do this hacky object spread thing. https://stackoverflow.com/questions/72720469/error-when-using-inert-attribute-with-typescript */}
        <div style={innerStyles} {...stylex.props(visualizationSuggestionCardStyles.renderContainer)} {...{ inert: '' }}>
          <PanelRenderer
            title=""
            data={previewData}
            pluginId={suggestion.pluginId}
            width={renderWidth}
            height={renderHeight}
            options={preview.options}
            fieldConfig={preview.fieldConfig}
          />
        </div>
      </div>
    );
  }

  return <Tooltip content={suggestion.description ?? suggestion.name}>{content}</Tooltip>;
}

;

interface PreviewDimensionsAndStyles {
  renderWidth: number;
  renderHeight: number;
  innerStyles: CSSProperties;
  outerStyles: CSSProperties;
}

function getPreviewDimensionsAndStyles(width: number): PreviewDimensionsAndStyles {
  const aspectRatio = 16 / 10;
  const renderWidth = 350;
  const renderHeight = renderWidth * (1 / aspectRatio);

  // width is 0 on the first render (before useMeasure)
  if (width === 0) {
    return {
      renderWidth,
      renderHeight,
      outerStyles: { width: '100%', aspectRatio: `${aspectRatio}` },
      innerStyles: { display: 'none' },
    };
  }

  const showWidth = width;
  const showHeight = width * (1 / aspectRatio);
  const padding = 6;
  const widthFactor = (showWidth - padding * 2) / renderWidth;
  const heightFactor = (showHeight - padding * 2) / renderHeight;

  return {
    renderHeight,
    renderWidth,
    outerStyles: { width: showWidth, height: showHeight },
    innerStyles: {
      width: renderWidth,
      height: renderHeight,
      transform: `scale(${widthFactor}, ${heightFactor})`,
    },
  };
}
