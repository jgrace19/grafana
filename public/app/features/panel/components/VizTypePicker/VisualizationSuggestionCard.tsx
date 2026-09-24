import * as stylex from '@stylexjs/stylex';
import { cloneDeep } from 'lodash';
import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

import { type PanelData, type PanelPluginVisualizationSuggestion } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Tooltip } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { durations, easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { PanelRenderer } from '../PanelRenderer';

import './VisualizationSuggestionCard.css';

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
    'data-testid': selectors.components.VisualizationPreview.card(suggestion.name),
    ...restProps,
  } satisfies HTMLAttributes<HTMLDivElement> & { 'data-testid': string };

  let content: ReactNode;

  if (cardOptions.imgSrc) {
    content = (
      <div
        {...commonButtonProps}
        {...mergeStylexProps(stylex.props(styles.vizBox, isSelected && styles.selected, styles.imgBox), {
          className,
          style: outerStyles,
        })}
      >
        <div {...stylex.props(styles.name)}>{suggestion.name}</div>
        <img {...stylex.props(styles.img)} src={cardOptions.imgSrc} alt={suggestion.name} />
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
      <div
        {...commonButtonProps}
        {...mergeStylexProps(stylex.props(styles.vizBox, isSelected && styles.selected), {
          className,
          style: outerStyles,
        })}
      >
        {/* to use inert in React 18, we have to do this hacky object spread thing. https://stackoverflow.com/questions/72720469/error-when-using-inert-attribute-with-typescript */}
        <div
          {...mergeStylexProps(stylex.props(styles.renderContainer), {
            className: 'gf-viz-suggestion-render-container',
            style: innerStyles,
          })}
          {...{ inert: '' }}
        >
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

const styles = stylex.create({
  vizBox: {
    position: 'relative',
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-background-secondary'] },
    backgroundImage: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
    cursor: 'pointer',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: { default: colors['--gf-colors-border-medium'], ':hover': colors['--gf-colors-primary-border'] },
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background, border-color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
  },
  selected: {
    borderColor: colors['--gf-colors-primary-border'],
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  imgBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifySelf: 'center',
    color: colors['--gf-colors-text-primary'],
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  name: {
    paddingBottom: spacing['--gf-spacing-x0-5'],
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    textOverflow: 'ellipsis',
  },
  img: {
    maxWidth: spacing['--gf-spacing-x8'],
    maxHeight: spacing['--gf-spacing-x8'],
  },
  renderContainer: {
    position: 'absolute',
    transformOrigin: 'left top',
    top: '6px',
    left: '6px',
  },
});

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
