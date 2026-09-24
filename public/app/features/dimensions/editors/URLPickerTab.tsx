import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { uRLPickerTabStyles } from './URLPickerTab.stylex';
import { type Dispatch, type SetStateAction } from 'react';

import { t } from '@grafana/i18n';
import { Field, Input, Label } from '@grafana/ui';
import { SanitizedSVG } from 'app/core/components/SVG/SanitizedSVG';

import { getPublicOrAbsoluteUrl } from '../resource';
import { MediaType } from '../types';

interface Props {
  newValue: string;
  setNewValue: Dispatch<SetStateAction<string>>;
  mediaType: MediaType;
}

export const URLPickerTab = (props: Props) => {
  const { newValue, setNewValue, mediaType } = props;

  const imgSrc = getPublicOrAbsoluteUrl(newValue!);

  let shortName = newValue?.substring(newValue.lastIndexOf('/') + 1, newValue.lastIndexOf('.'));
  if (shortName.length > 20) {
    shortName = shortName.substring(0, 20) + '...';
  }

  return (
    <>
      <Field>
        <Input onChange={(e) => setNewValue(e.currentTarget.value)} value={newValue} />
      </Field>
      <div {...stylex.props(uRLPickerTabStyles.iconContainer)}>
        <Field label={t('dimensions.urlpicker-tab.label-preview', 'Preview')}>
          <div {...stylex.props(uRLPickerTabStyles.iconPreview)}>
            {mediaType === MediaType.Icon && <SanitizedSVG src={imgSrc} {...stylex.props(uRLPickerTabStyles.img)} />}
            {mediaType === MediaType.Image && newValue && (
              <img src={imgSrc} alt="Preview of the selected URL" {...stylex.props(uRLPickerTabStyles.img)} />
            )}
          </div>
        </Field>
        <Label>{shortName}</Label>
      </div>
    </>
  );
};

