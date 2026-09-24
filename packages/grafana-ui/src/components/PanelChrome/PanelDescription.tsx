
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { panelDescriptionStyleProps } from './PanelDescription.stylex'

import type { JSX } from 'react';


import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import { TitleItem } from './TitleItem';

interface Props {
  description: string | (() => string);
  className?: string;
}

export function PanelDescription({ description, className }: Props) {

  const getDescriptionContent = (): JSX.Element => {
    // description
    const panelDescription = typeof description === 'function' ? description() : description;

    return (
      <div className="panel-info-content markdown-html">
        <div dangerouslySetInnerHTML={{ __html: panelDescription }} />
      </div>
    );
  };

  return description !== '' ? (
    <Tooltip interactive content={getDescriptionContent}>
      <TitleItem {...mergeStylexClassName(panelDescriptionStyleProps('description'), className)}>
        <Icon name="info-circle" size="md" />
      </TitleItem>
    </Tooltip>
  ) : null;
}

;
