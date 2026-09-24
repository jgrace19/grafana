import * as stylex from '@stylexjs/stylex';
import { type FormEvent, useCallback, useState } from 'react';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shadows, spacing } from '../../themes/stylex/tokens.stylex';
import { type ComponentSize } from '../../types/size';
import { trimFileName } from '../../utils/file';
import { getButtonStylexStyles } from '../Button/Button';
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
  const theme = useTheme2();
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
        {...mergeStylexProps(
          stylex.props(getButtonStylexStyles(theme, 'primary', 'solid', size, false), styles.labelWrapper),
          { className }
        )}
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

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;
const focusEasing = 'cubic-bezier(0.19, 1, 0.22, 1)';

// The label is a primary solid Button; focusing the hidden input shows the focus ring on it.
const styles = stylex.create({
  // No width/height: the global `input[type='file']` rules set them, and won over the Emotion ones on main.
  fileUpload: {
    opacity: '0',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  labelWrapper: {
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
