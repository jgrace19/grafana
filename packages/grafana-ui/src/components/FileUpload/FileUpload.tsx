import * as stylex from '@stylexjs/stylex';
import { type FormEvent, useCallback, useState } from 'react';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type ComponentSize } from '../../types/size';
import { trimFileName } from '../../utils/file';
import { Icon } from '../Icon/Icon';

import { fileInputMarker } from './markers.stylex';

export interface Props {
  /** Callback function to handle uploaded file  */
  onFileUpload: (event: FormEvent<HTMLInputElement>) => void;
  /** Accepted file extensions */
  accept?: string;
  /** Overwrite or add to style */
  className?: string;
  /** Button size */
  size?: ComponentSize;
  /** Show the file name */
  showFileName?: boolean;
}

/**
 * A button-styled input that triggers file upload popup. Button text and accepted file extensions can be customized via `label` and `accepted` props respectively.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-fileupload--docs
 */
export const FileUpload = ({
  onFileUpload,
  className,
  children = 'Upload file',
  accept = '*',
  size = 'md',
  showFileName,
}: React.PropsWithChildren<Props>) => {
  const [fileName, setFileName] = useState('');
  const id = uuidv4();

  const onChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const file = event.currentTarget?.files?.[0];
      if (file) {
        setFileName(file.name ?? '');
      }
      onFileUpload(event);
    },
    [onFileUpload]
  );

  return (
    <>
      <input
        type="file"
        id={id}
        {...stylex.props(styles.fileUpload, fileInputMarker)}
        onChange={onChange}
        multiple={false}
        accept={accept}
        data-testid={selectors.components.FileUpload.inputField}
      />
      <label
        htmlFor={id}
        {...mergeStylexProps(stylex.props(styles.labelWrapper, sizeStyles[toButtonSize(size)]), { className })}
      >
        <Icon name="upload" />
        {children}
      </label>

      {showFileName && fileName && (
        <span
          aria-label={t('grafana-ui.file-upload.file-name', 'File name')}
          {...stylex.props(styles.fileName)}
          data-testid={selectors.components.FileUpload.fileNameSpan}
        >
          {trimFileName(fileName)}
        </span>
      )}
    </>
  );
};

// `xs` has no button size of its own and renders as `md`.
const toButtonSize = (size: ComponentSize) => (size === 'sm' || size === 'lg' ? size : 'md');

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;
const focusEasing = 'cubic-bezier(0.19, 1, 0.22, 1)';
const buttonHeight = (height: string) => `calc(${spacing['--gf-spacing-grid-size']} * ${height})`;

// The label looks like a primary solid Button (keep in sync with Button.tsx); focusing the hidden input shows
// the focus ring on it.
const styles = stylex.create({
  fileUpload: {
    height: '0.1px',
    opacity: '0',
    overflow: 'hidden',
    position: 'absolute',
    width: '0.1px',
    zIndex: -1,
  },
  labelWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontFamily: typography['--gf-typography-font-family'],
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: 'middle',
    cursor: 'pointer',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundColor: {
      default: colors['--gf-colors-primary-main'],
      ':hover': colors['--gf-colors-primary-shade'],
      ':active': colors['--gf-colors-primary-main'],
    },
    color: colors['--gf-colors-primary-contrast-text'],
    boxShadow: {
      default: null,
      ':hover': {
        default: shadows['--gf-shadows-z1'],
        [stylex.when.siblingBefore(':focus', fileInputMarker)]: focusRing,
      },
      [stylex.when.siblingBefore(':focus', fileInputMarker)]: focusRing,
    },
    outlineStyle: { default: null, [stylex.when.siblingBefore(':focus', fileInputMarker)]: 'dotted' },
    outlineWidth: { default: null, [stylex.when.siblingBefore(':focus', fileInputMarker)]: '2px' },
    outlineColor: { default: null, [stylex.when.siblingBefore(':focus', fileInputMarker)]: 'transparent' },
    outlineOffset: { default: null, [stylex.when.siblingBefore(':focus', fileInputMarker)]: '2px' },
    transitionProperty: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: 'background-color, border-color, color',
        [stylex.when.siblingBefore(':focus', fileInputMarker)]: 'outline, outline-offset, box-shadow',
      },
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: durations.short,
        [stylex.when.siblingBefore(':focus', fileInputMarker)]: '0.2s',
      },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: easings.easeInOut,
        [stylex.when.siblingBefore(':focus', fileInputMarker)]: focusEasing,
      },
    },
  },
  fileName: {
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
});

// Horizontal padding deducts the 1px border; line-height deducts both borders for vertical centering on Windows and Linux.
const sizeStyles = stylex.create({
  sm: {
    fontSize: typography['--gf-typography-size-sm'],
    height: buttonHeight(components['--gf-components-height-sm']),
    lineHeight: `calc(${buttonHeight(components['--gf-components-height-sm'])} - 2px)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} - 1px)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} - 1px)`,
  },
  md: {
    fontSize: typography['--gf-typography-size-md'],
    height: buttonHeight(components['--gf-components-height-md']),
    lineHeight: `calc(${buttonHeight(components['--gf-components-height-md'])} - 2px)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2 - 1px)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 2 - 1px)`,
  },
  lg: {
    fontSize: typography['--gf-typography-size-lg'],
    height: buttonHeight(components['--gf-components-height-lg']),
    lineHeight: `calc(${buttonHeight(components['--gf-components-height-lg'])} - 2px)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 3 - 1px)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 3 - 1px)`,
  },
});
