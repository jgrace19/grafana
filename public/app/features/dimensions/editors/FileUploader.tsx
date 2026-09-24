import * as stylex from '@stylexjs/stylex';
import { type Dispatch, type SetStateAction, useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { FileDropzone, Button, type DropzoneFile, Field } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { SanitizedSVG } from 'app/core/components/SVG/SanitizedSVG';

import { MediaType } from '../types';

interface Props {
  setFormData: Dispatch<SetStateAction<FormData>>;
  mediaType: MediaType;
  setUpload: Dispatch<SetStateAction<boolean>>;
  newValue: string;
  error: ErrorResponse;
}
interface ErrorResponse {
  message: string;
}
export function FileDropzoneCustomChildren({ secondaryText = 'Drag and drop here or browse' }) {
  return (
    <div {...stylex.props(styles.iconWrapper)}>
      <small {...stylex.props(styles.small)}>{secondaryText}</small>
      <Button type="button" icon="upload">
        <Trans i18nKey="dimensions.file-dropzone-custom-children.upload">Upload</Trans>
      </Button>
    </div>
  );
}
export const FileUploader = ({ mediaType, setFormData, setUpload, error }: Props) => {
  const [dropped, setDropped] = useState<boolean>(false);
  const [file, setFile] = useState<string>('');

  const Preview = () => (
    <Field label={t('dimensions.file-uploader.preview.label-preview', 'Preview')}>
      <div {...stylex.props(styles.iconPreview)}>
        {mediaType === MediaType.Icon && <SanitizedSVG src={file} className={stylex.props(styles.img).className} />}
        {mediaType === MediaType.Image && (
          <img src={file} alt="Preview of the uploaded file" {...stylex.props(styles.img)} />
        )}
      </div>
    </Field>
  );

  const onFileRemove = (file: DropzoneFile) => {
    fetch(`/api/storage/delete/upload/${file.file.name}`, {
      method: 'DELETE',
    }).catch((error) => console.error('cannot delete file', error));
  };

  const acceptableFiles =
    mediaType === 'icon' ? { 'image/*': ['.svg', '.xml'] } : { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] };
  return (
    <FileDropzone
      readAs="readAsBinaryString"
      onFileRemove={onFileRemove}
      options={{
        accept: acceptableFiles,
        multiple: false,
        onDrop: (acceptedFiles: File[]) => {
          let formData = new FormData();
          formData.append('file', acceptedFiles[0]);
          setFile(URL.createObjectURL(acceptedFiles[0]));
          setDropped(true);
          setFormData(formData);
          setUpload(true);
        },
      }}
    >
      {error.message !== '' && dropped ? (
        <p>{error.message}</p>
      ) : dropped ? (
        <Preview />
      ) : (
        <FileDropzoneCustomChildren />
      )}
    </FileDropzone>
  );
};

const styles = stylex.create({
  iconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  small: {
    color: colors['--gf-colors-text-secondary'],
    marginBottom: spacing['--gf-spacing-x2'],
  },
  iconPreview: {
    width: '238px',
    height: '198px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '147px',
    height: '147px',
    fill: colors['--gf-colors-text-primary'],
  },
});
