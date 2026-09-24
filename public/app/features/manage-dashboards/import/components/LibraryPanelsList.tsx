import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { libraryPanelsListStyles } from './LibraryPanelsList.stylex';
import { type ReactElement } from 'react';

import { Field } from '@grafana/ui';

import { LibraryPanelCard } from '../../../library-panels/components/LibraryPanelCard/LibraryPanelCard';
import { type LibraryElementDTO } from '../../../library-panels/types';
import { type LibraryPanelInput, LibraryPanelInputState } from '../../types';

interface Props {
  inputs: LibraryPanelInput[];
  label: string;
  description: string;
  folderName?: string;
}

const DEFAULT_FOLDER_NAME = 'Dashboards';

export function LibraryPanelsList({ inputs, label, description, folderName }: Props): ReactElement | null {

  if (!Boolean(inputs?.length)) {
    return null;
  }

  return (
    <div {...stylex.props(libraryPanelsListStyles.spacer)}>
      <Field label={label} description={description} noMargin>
        <>
          {inputs.map((input, index) => {
            const libraryPanelIndex = `elements[${index}]`;
            // For new panels, override folderName in meta; existing panels use model as-is
            const libraryPanel: LibraryElementDTO =
              input.state === LibraryPanelInputState.New && input.model.meta
                ? {
                    ...input.model,
                    meta: {
                      ...input.model.meta,
                      folderName: folderName ?? input.model.meta.folderName ?? DEFAULT_FOLDER_NAME,
                    },
                  }
                : input.model;

            return (
              <div {...stylex.props(libraryPanelsListStyles.item)} key={libraryPanelIndex}>
                <LibraryPanelCard libraryPanel={libraryPanel} onClick={() => undefined} />
              </div>
            );
          })}
        </>
      </Field>
    </div>
  );
}

