
import { featureInfoBoxStyleProps } from './FeatureInfoBox.stylex'

import { memo, forwardRef } from 'react';

import { type FeatureState, } from '@grafana/data';

import { FeatureBadge } from '../FeatureBadge/FeatureBadge';

import { InfoBox, type InfoBoxProps } from './InfoBox';

export interface FeatureInfoBoxProps extends Omit<InfoBoxProps, 'title' | 'urlTitle'> {
  title: string;
  featureState?: FeatureState;
}

/** @deprecated use Alert with severity info */
export const FeatureInfoBox = memo(
  forwardRef<HTMLDivElement, FeatureInfoBoxProps>(({ title, featureState, ...otherProps }, ref) => {

    const titleEl = featureState ? (
      <>
        <div {...featureInfoBoxStyleProps('badge')}>
          <FeatureBadge featureState={featureState} />
        </div>
        <h3>{title}</h3>
      </>
    ) : (
      <h3>{title}</h3>
    );
    return <InfoBox branded title={titleEl} urlTitle="Read documentation" ref={ref} {...otherProps} />;
  })
);

FeatureInfoBox.displayName = 'FeatureInfoBox';

;
