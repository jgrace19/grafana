import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { InlineToast } from '../InlineToast/InlineToast';
import { Tooltip } from '../Tooltip/Tooltip';

import { ColorIndicatorPosition, VizTooltipColorIndicator } from './VizTooltipColorIndicator';
import { ColorPlacement, type VizTooltipItem } from './types';

interface VizTooltipRowProps extends Omit<VizTooltipItem, 'value'> {
  value: string | number | null | ReactNode;
  justify?: string;
  isActive?: boolean; // for series list
  marginRight?: string;
  isPinned: boolean;
  showValueScroll?: boolean;
  isHiddenFromViz?: boolean;
}

enum LabelValueTypes {
  label = 'label',
  value = 'value',
}

const SUCCESSFULLY_COPIED_TEXT = 'Copied to clipboard';
const SHOW_SUCCESS_DURATION = 2 * 1000;
const HORIZONTAL_PX_PER_CHAR = 7;
const CAN_COPY = Boolean(navigator.clipboard && window.isSecureContext);

export const VizTooltipRow = ({
  label,
  value,
  color,
  colorIndicator,
  colorPlacement = ColorPlacement.first,
  justify = 'start',
  isActive = false,
  marginRight,
  isPinned,
  lineStyle,
  showValueScroll,
  isHiddenFromViz,
}: VizTooltipRowProps) => {
  const innerValueScrollStyle: CSSProperties = showValueScroll
    ? {
        maxHeight: 55,
        whiteSpace: 'wrap',
        wordBreak: 'break-word',
        overflowY: 'auto',
      }
    : {
        whiteSpace: 'pre-line',
        wordBreak: 'break-word',
        lineHeight: 1.2,
      };

  const [showLabelTooltip, setShowLabelTooltip] = useState(false);

  const [copiedText, setCopiedText] = useState<Record<string, string> | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const labelRef = useRef<null | HTMLDivElement>(null);
  const valueRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (showCopySuccess) {
      timeoutId = setTimeout(() => {
        setShowCopySuccess(false);
      }, SHOW_SUCCESS_DURATION);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showCopySuccess]);

  const copyToClipboard = async (text: string, type: LabelValueTypes) => {
    if (!CAN_COPY) {
      fallbackCopyToClipboard(text, type);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText({ [`${type}`]: text });
      setShowCopySuccess(true);
    } catch (error) {
      setCopiedText(null);
    }
  };

  const fallbackCopyToClipboard = (text: string, type: LabelValueTypes) => {
    // Use a fallback method for browsers/contexts that don't support the Clipboard API.
    const textarea = document.createElement('textarea');
    labelRef.current?.appendChild(textarea);
    textarea.value = text;
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedText({ [`${type}`]: text });
        setShowCopySuccess(true);
      }
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }

    textarea.remove();
  };

  const onMouseEnterLabel = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget.offsetWidth < event.currentTarget.scrollWidth) {
      setShowLabelTooltip(true);
    }
  };

  const onMouseLeaveLabel = () => setShowLabelTooltip(false);

  // if label is > 50% window width, try to put label/value pairs on new lines
  if (label.length * HORIZONTAL_PX_PER_CHAR > window.innerWidth / 2) {
    label = label.replaceAll('{', '{\n  ').replaceAll('}', '\n}').replaceAll(', ', ',\n  ');
  }

  return (
    <div {...stylex.props(styles.contentWrapper, styles.justify(justify))}>
      {color && colorPlacement === ColorPlacement.first && (
        <div {...stylex.props(styles.colorWrapper)}>
          <VizTooltipColorIndicator
            color={color}
            colorIndicator={colorIndicator}
            lineStyle={lineStyle}
            isHollow={isHiddenFromViz}
          />
        </div>
      )}
      {label && (
        <div {...stylex.props(styles.labelWrapper)}>
          {!isPinned ? (
            <div {...stylex.props(styles.label, isActive && styles.activeSeries)}>{label}</div>
          ) : (
            <>
              <Tooltip content={label} interactive={false} show={showLabelTooltip}>
                <>
                  {showCopySuccess && copiedText?.label && (
                    <InlineToast placement="top" referenceElement={labelRef.current}>
                      {SUCCESSFULLY_COPIED_TEXT}
                    </InlineToast>
                  )}
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                  <div
                    {...stylex.props(styles.label, isActive && styles.activeSeries, CAN_COPY && styles.copy)}
                    onMouseEnter={onMouseEnterLabel}
                    onMouseLeave={onMouseLeaveLabel}
                    onClick={() => copyToClipboard(label, LabelValueTypes.label)}
                    ref={labelRef}
                  >
                    {label}
                  </div>
                </>
              </Tooltip>
            </>
          )}
        </div>
      )}

      <div {...stylex.props(styles.valueWrapper, marginRight !== undefined && styles.marginRight(marginRight))}>
        {color && colorPlacement === ColorPlacement.leading && (
          <VizTooltipColorIndicator
            color={color}
            colorIndicator={colorIndicator}
            position={ColorIndicatorPosition.Leading}
            lineStyle={lineStyle}
          />
        )}

        {!isPinned ? (
          <div className={stylex.props(styles.value).className} style={innerValueScrollStyle}>
            {value}
          </div>
        ) : (
          <>
            {showCopySuccess && copiedText?.value && (
              <InlineToast placement="top" referenceElement={valueRef.current}>
                {SUCCESSFULLY_COPIED_TEXT}
              </InlineToast>
            )}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div
              className={stylex.props(styles.value, CAN_COPY && styles.copy).className}
              style={innerValueScrollStyle}
              onClick={() => copyToClipboard(value ? value.toString() : '', LabelValueTypes.value)}
              ref={valueRef}
            >
              {value}
            </div>
          </>
        )}

        {color && colorPlacement === ColorPlacement.trailing && (
          <VizTooltipColorIndicator
            color={color}
            colorIndicator={colorIndicator}
            position={ColorIndicatorPosition.Trailing}
            lineStyle={lineStyle}
          />
        )}
      </div>
    </div>
  );
};

const styles = stylex.create({
  contentWrapper: {
    display: 'flex',
    maxWidth: '100%',
    alignItems: 'start',
    columnGap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  justify: (justifyContent: string) => ({
    justifyContent,
  }),
  label: { display: 'inline' },
  value: {
    fontWeight: 500,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  colorWrapper: {
    alignSelf: 'center',
    flexShrink: 0,
  },
  labelWrapper: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: colors['--gf-colors-text-secondary'],
    fontWeight: 400,
  },
  valueWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'center',
  },
  marginRight: (marginRight: string) => ({
    marginRight,
  }),
  activeSeries: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
    color: colors['--gf-colors-text-max-contrast'],
  },
  copy: {
    cursor: 'pointer',
  },
});
