import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';

import { formattedValueToString, getValueFormat } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';

import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { trimFileName } from '../../utils/file';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

import { type DropzoneFile } from './FileDropzone';

import './FileListItem.css';

export const REMOVE_FILE = 'Remove file';
export interface FileListItemProps {
  file: DropzoneFile;
  removeFile?: (file: DropzoneFile) => void;
}

/**
 * A FileListItem component used for the FileDropzone component to show uploaded files.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-filelistitem--docs
 */
export function FileListItem({ file: customFile, removeFile }: FileListItemProps) {
  const { file, progress, error, abortUpload, retryUpload } = customFile;

  const renderRightSide = () => {
    if (error) {
      return (
        <>
          <span {...stylex.props(styles.error)}>{error.message}</span>
          {retryUpload && (
            <IconButton
              name="sync"
              tooltip={t('grafana-ui.file-dropzone.item-retry', 'Retry')}
              tooltipPlacement="top"
              onClick={retryUpload}
            />
          )}
          {removeFile && (
            <IconButton
              xstyle={retryUpload ? styles.remove : undefined}
              name="trash-alt"
              onClick={() => removeFile(customFile)}
              tooltip={REMOVE_FILE}
            />
          )}
        </>
      );
    }

    if (progress && file.size > progress) {
      return (
        <>
          <progress
            className={clsx('gf-file-list-item-progress', stylex.props(styles.progressBar).className)}
            max={file.size}
            value={progress}
          />
          <span {...stylex.props(styles.paddingLeft)}>
            {Math.round((progress / file.size) * 100)}
            {'%'}
          </span>
          {abortUpload && (
            <Button variant="secondary" type="button" fill="text" onClick={abortUpload}>
              <Trans i18nKey="grafana-ui.file-dropzone.cancel-upload">Cancel upload</Trans>
            </Button>
          )}
        </>
      );
    }
    return (
      removeFile && (
        <IconButton
          name="trash-alt"
          onClick={() => removeFile(customFile)}
          tooltip={REMOVE_FILE}
          tooltipPlacement="top"
        />
      )
    );
  };

  const valueFormat = getValueFormat('decbytes')(file.size);

  return (
    <div {...stylex.props(styles.fileListContainer)}>
      <span {...stylex.props(styles.fileNameWrapper)}>
        <Icon name="file-blank" size="lg" aria-hidden={true} />
        <span {...stylex.props(styles.padding)}>{trimFileName(file.name)}</span>
        <span>{formattedValueToString(valueFormat)}</span>
      </span>

      <div {...stylex.props(styles.fileNameWrapper)}>{renderRightSide()}</div>
    </div>
  );
}

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  remove: {
    marginLeft: spacing['--gf-spacing-grid-size'],
  },
  fileListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `calc(${grid} * 2)`,
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: colors['--gf-colors-border-medium'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    marginTop: grid,
  },
  fileNameWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  padding: {
    paddingTop: 0,
    paddingRight: grid,
    paddingBottom: 0,
    paddingLeft: grid,
  },
  paddingLeft: {
    paddingLeft: `calc(${grid} * 2)`,
  },
  error: {
    paddingRight: `calc(${grid} * 2)`,
    color: colors['--gf-colors-error-text'],
  },
  progressBar: {
    borderRadius: shape['--gf-shape-radius-default'],
    height: '4px',
  },
});
