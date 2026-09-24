import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { fileUploaderStyles } from './FileUploader.stylex';
import { type Dispatch, type SetStateAction, useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { FileDropzone, Button, type DropzoneFile, Field } from '@grafana/ui';
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
    <div {...stylex.props(fileUploaderStyles.iconWrapper)}>
      <small {...stylex.props(fileUploaderStyles.small)}>{secondaryText}</small>
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
      <div {...stylex.props(fileUploaderStyles.iconPreview)}>
        {mediaType === MediaType.Icon && <SanitizedSVG src={file} {...stylex.props(fileUploaderStyles.img)} />}
        {mediaType === MediaType.Image && <img src={file} alt="Preview of the uploaded file" {...stylex.props(fileUploaderStyles.img)} />}
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

