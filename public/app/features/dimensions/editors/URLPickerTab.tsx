import * as stylex from '@stylexjs/stylex';
import { type Dispatch, type SetStateAction } from 'react';

import { t } from '@grafana/i18n';
import { Field, Input, Label } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';
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
      <div {...stylex.props(styles.iconContainer)}>
        <Field label={t('dimensions.urlpicker-tab.label-preview', 'Preview')}>
          <div {...stylex.props(styles.iconPreview)}>
            {mediaType === MediaType.Icon && (
              <SanitizedSVG src={imgSrc} className={stylex.props(styles.img).className} />
            )}
            {mediaType === MediaType.Image && newValue && (
              <img src={imgSrc} alt="Preview of the selected URL" {...stylex.props(styles.img)} />
            )}
          </div>
        </Field>
        <Label>{shortName}</Label>
      </div>
    </>
  );
};

const styles = stylex.create({
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
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
